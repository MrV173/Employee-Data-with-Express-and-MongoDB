const mongoose = require('mongoose');

const Data = mongoose.model('Data',{
    employeeId: {
        type: String,
    },
    nama: {
        type: String,
        required : true,
    },
    noHp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    jenis_kelamin: {
        type: String,
        required: true,
    },
    tanggal_lahir: {
        type: String,
        required: true,
    },
    alamat: {
        type: String,
        required: true,
    },
    status_pernikahan: {
        type: String,
        required: true,
    },
    status_karyawan: {
        type: String,
        required: true,
    },
    posisi: {
        type: String,
        required: true,
    },
    join_date: {
        type: String,
        required: true,
    }
});

module.exports = Data;