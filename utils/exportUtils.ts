

import * as XLSX from 'https://esm.sh/xlsx';
import { LeaderboardEntry, Participant, MasterTask, Training, DetailedTask, ParticipantRole, MasterTaskData, Justification } from '../types';
import { getCompletedTasksByParticipants } from '../services/supabase';

export const exportLeaderboardToExcel = async (
    leaderboard: LeaderboardEntry[],
    participants: Participant[],
    masterTasks: MasterTask[],
    training: Training
) => {
    const wb = XLSX.utils.book_new();

    // --- 1. Leaderboard Sheet ---
    if (leaderboard.length > 0) {
        const leaderboardHeaders = ['Peringkat', 'Nama Peserta', 'Poin Penyelesaian', 'Poin Ketepatan', 'Nilai Akhir', 'Keterangan'];
        const leaderboardData = leaderboard.map((entry, index) => [
            index + 1,
            entry.participantName,
            entry.taskCompletionScore,
            entry.onTimeScore,
            entry.finalGrade,
            entry.description,
        ]);

        const leaderboardSheetData = [
            [`Laporan Leaderboard Batch: ${training.name}`],
            [`Tanggal Laporan: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`],
            [], // spacer
            leaderboardHeaders,
            ...leaderboardData
        ];
        
        const wsLeaderboard = XLSX.utils.aoa_to_sheet(leaderboardSheetData);

        const leaderboardColWidths = leaderboardHeaders.map((header, i) => ({
            wch: Math.max(
                header.length,
                ...leaderboardSheetData.map(row => (row[i] ? String(row[i]).length : 0))
            ) + 2
        }));
        wsLeaderboard['!cols'] = leaderboardColWidths;

        XLSX.utils.book_append_sheet(wb, wsLeaderboard, 'Leaderboard');
    }

    // --- 2. Detailed Task Sheet ---
    const allCompletedTasks = await getCompletedTasksByParticipants(participants.map(p => p.id));
    const completedTasksMap = new Map(allCompletedTasks.map(cst => [`${cst.participant_id}-${cst.task_id}`, cst]));
    
    const tasksHeaders = ['Nama Peserta', 'Posisi', 'Hari Ke-', 'Backlog', 'User Story', 'Target Poin', 'Status', 'Tanggal Selesai'];
    const allDetailedTasksData = participants.flatMap(p => {
        const participantTasks = masterTasks.filter(mt => mt.role === p.role);

        return participantTasks.map(mTask => {
            const completedTask = completedTasksMap.get(`${p.id}-${mTask.id}`);
            let status = 'Belum Selesai';
            let completionDateStr = '-';

            if (completedTask) {
                completionDateStr = new Date(completedTask.completion_date).toLocaleDateString('id-ID');
                const dueDate = new Date(training.start_date);
                dueDate.setUTCHours(0, 0, 0, 0);
                dueDate.setUTCDate(dueDate.getUTCDate() + mTask.day_number - 1);
                const completionDate = new Date(completedTask.completion_date);
                completionDate.setUTCHours(0, 0, 0, 0);
                status = completionDate <= dueDate ? 'Tepat Waktu' : 'Terlambat';
            }
            return [
                p.name,
                p.role,
                mTask.day_number,
                mTask.backlog || '-',
                mTask.user_story,
                mTask.target_points,
                status,
                completionDateStr
            ];
        });
    });

    if (allDetailedTasksData.length > 0) {
        const tasksSheetData = [
            [`Rincian Pengerjaan Task - Batch: ${training.name}`],
            [], // spacer
            tasksHeaders,
            ...allDetailedTasksData
        ];

        const wsTasks = XLSX.utils.aoa_to_sheet(tasksSheetData);
        
        const tasksColWidths = tasksHeaders.map((header, i) => ({
             wch: Math.max(
                header.length,
                ...tasksSheetData.map(row => (row[i] ? String(row[i]).length : 0))
            ) + 2
        }));
         // Specific widths
        tasksColWidths[0].wch = 25; // Nama
        tasksColWidths[1].wch = 20; // Posisi
        tasksColWidths[4].wch = 40; // User Story
        tasksColWidths[5].wch = 15; // Target Poin
        
        wsTasks['!cols'] = tasksColWidths;

        XLSX.utils.book_append_sheet(wb, wsTasks, 'Rincian Task');
    }
    
    // --- 3. Write File ---
    if (wb.SheetNames.length > 0) {
        XLSX.writeFile(wb, `Laporan_Batch_${training.name.replace(/\s/g, '_')}.xlsx`);
    } else {
        throw new Error("Tidak ada data untuk diekspor.");
    }
};

export const exportParticipantReportToExcel = (
    participant: Participant,
    training: Training,
    detailedTasks: DetailedTask[],
    leaderboardEntry: LeaderboardEntry
) => {
    const wb = XLSX.utils.book_new();

    // --- Sheet 1: Summary ---
    const summaryData = [
        ['Laporan Penilaian Peserta'],
        [],
        ['Nama Peserta', participant.name],
        ['Posisi', participant.role],
        ['Batch Training', training.name],
        ['Periode Training', `${new Date(training.start_date).toLocaleDateString('id-ID')} - ${new Date(training.end_date).toLocaleDateString('id-ID')}`],
        [],
        ['Ringkasan Penilaian'],
        ['Poin Penyelesaian Task', leaderboardEntry.taskCompletionScore],
        ['Poin Tepat Waktu', leaderboardEntry.onTimeScore],
        ['Nilai Akhir', leaderboardEntry.finalGrade],
        ['Keterangan', leaderboardEntry.description],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
        { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } }
    ];
    wsSummary['!cols'] = [{ wch: 25 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Penilaian');


    // --- Sheet 2: Detailed Tasks ---
    const tasksData = detailedTasks.map(task => ({
        'Hari Ke-': task.day_number,
        'Backlog': task.backlog || '-',
        'Kategori': task.category || '-',
        'User Story': task.user_story,
        'Target Poin': task.target_points,
        'Status': task.status,
        'Tanggal Selesai': task.completionDate ? new Date(task.completionDate).toLocaleDateString('id-ID') : '-',
    }));

    if (tasksData.length > 0) {
        const wsTasks = XLSX.utils.json_to_sheet(tasksData);
        wsTasks['!cols'] = [
            { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 50 },
            { wch: 15 }, { wch: 15 }, { wch: 20 }
        ];
        XLSX.utils.book_append_sheet(wb, wsTasks, 'Rincian Task');
    }

    // --- Write File ---
    XLSX.writeFile(wb, `Laporan_${participant.name.replace(/\s/g, '_')}_${training.name.replace(/\s/g, '_')}.xlsx`);
};

export const exportMasterTasksToExcel = (tasks: MasterTask[]) => {
    const dataToExport = tasks.map(task => ({
        day_number: task.day_number,
        backlog: task.backlog || '',
        category: task.category || '',
        user_story: task.user_story,
        role: task.role,
        target_points: task.target_points,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    ws['!cols'] = [
        { wch: 10 }, // day_number
        { wch: 25 }, // backlog
        { wch: 25 }, // category
        { wch: 50 }, // user_story
        { wch: 20 }, // role
        { wch: 15 }, // target_points
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Master Tasks');
    XLSX.writeFile(wb, 'Master_Tasks_Export.xlsx');
};

export const downloadMasterTaskSample = () => {
    const sampleData: (Omit<MasterTaskData, 'role'> & { role: string })[] = [
        {
            day_number: 1,
            backlog: "Otentikasi",
            category: "Fundamental",
            user_story: "Sebagai pengguna, saya ingin bisa login ke aplikasi.",
            role: ParticipantRole.FRONTEND,
            target_points: 10
        },
        {
            day_number: 1,
            backlog: "Otentikasi",
            category: "API",
            user_story: "Membuat endpoint API untuk login.",
            role: ParticipantRole.BACKEND,
            target_points: 10
        },
        {
            day_number: 2,
            backlog: "Dashboard",
            category: "UI/UX",
            user_story: "Menampilkan data statistik di halaman utama.",
            role: ParticipantRole.FRONTEND,
            target_points: 15
        }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData, {header: ["day_number", "backlog", "category", "user_story", "role", "target_points"]});

    ws['!cols'] = [
        { wch: 12 },
        { wch: 25 },
        { wch: 25 },
        { wch: 50 },
        { wch: 20 },
        { wch: 15 },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sample Master Tasks');
    XLSX.writeFile(wb, 'Sample_Master_Tasks.xlsx');
};

export const exportJustificationsToExcel = (justifications: Justification[]) => {
    const dataToExport = justifications.map(j => ({
        skor_mentah: j.min_tasks,
        nilai_konversi: j.score,
        deskripsi: j.description,
        role: j.role,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport, { header: ["skor_mentah", "nilai_konversi", "deskripsi", "role"] });

    ws['!cols'] = [
        { wch: 15 }, // skor_mentah
        { wch: 15 }, // nilai_konversi
        { wch: 30 }, // deskripsi
        { wch: 20 }, // role
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Justifikasi Task');
    XLSX.writeFile(wb, 'Justifikasi_Task_Export.xlsx');
};

export const downloadJustificationSample = () => {
    const sampleData = [
        {
            skor_mentah: 0,
            nilai_konversi: 10,
            deskripsi: "Sangat Kurang",
            role: ParticipantRole.FRONTEND
        },
        {
            skor_mentah: 1,
            nilai_konversi: 13,
            deskripsi: "Sangat Kurang",
            role: ParticipantRole.FRONTEND
        },
        {
            skor_mentah: 10,
            nilai_konversi: 33,
            deskripsi: "Kurang",
            role: ParticipantRole.BACKEND
        },
        {
            skor_mentah: 11,
            nilai_konversi: 35,
            deskripsi: "Kurang",
            role: ParticipantRole.BACKEND
        }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);

    ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
        { wch: 20 },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sample Justifikasi Task');
    XLSX.writeFile(wb, 'Sample_Justifikasi_Task.xlsx');
};