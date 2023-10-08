const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const Data = require('./model/data');
require('./utility/database');

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Mongo Data Employees | Listening at http://localhost:${port}`);
});

const randomNumber= (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateEmployeeId = () => {
    const employeeId = randomNumber(1000, 9999);
    return `${employeeId}`;
}

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge:6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());

app.get('/', (req, res) => {
    res.render('index',{
        layout: 'layouts/main-layout',
        title: 'Home Page'
    })
})

app.get('/employe', async (req, res) => {

    const datas = await Data.find();

    res.render('employe', {
        layout: 'layouts/main-layout',
        title: 'Employe Page',
        datas,
        msg: req.flash('msg'),
    })
})

app.get('/brands', (req, res) => {
    res.render('brands', {
        layout: 'layouts/main-layout',
        title: 'Brands Page'
    })
})

app.get('/employe/add', (req,res) => {
    const employeeID = generateEmployeeId()
    res.render('add-employe', {
        title: 'Form Add Employe',
        layout: 'layouts/main-layout',
        employeeID,
    })
})

app.post('/employe', [
    body('nama').custom( async (value) => {
        const duplicate = await Data.findOne({ nama: value})
        if(duplicate) {
            throw new Error('Employe Name already used')
        }
        return true
    }),
    check('email', 'email tidak valid').isEmail(),
    check('noHp', 'No hp tidak valid').isMobilePhone('id-ID'),
    ], (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            res.render('add-employe', {
                title: 'Form Add Emplote',
                layout: 'layouts/main-layout',
                errors: errors.array(),
            })
        } else {
            Data.insertMany(req.body);
            req.flash('msg','Employe Data has been add succesfully');
            res.redirect('/employe')
        }
    })

app.get('/employe/:nama', async (req, res) => {
    const data = await Data.findOne({ nama: req.params.nama});

    res.render('detail-employe', {
        layout:'layouts/main-layout',
        title: 'Detail Page',
        data,   
    });
});

app.delete('/employe', (req,res) => {
    Data.deleteOne({ nama: req.body.nama}).then();
    req.flash('msg', 'Data Contact Has Been Deleted');
    res.redirect('/employe')
})

app.get('/employe/update/:nama', async (req, res) => {
    const data = await Data.findOne({ nama: req.params.nama});

    res.render('update-employe', {
        title : 'Update Employe Data Form',
        layout: 'layouts/main-layout',
        data,  
    })
})

app.put('/employe', [
    body('nama').custom( async (value, {req}) => {
        const duplicate = await Data.findOne({ nama : value })
        if(value !== req.body.oldNama && duplicate) {
            throw new Error('Employe Name Already used')
        }
        return true
    }),
    check('email', 'email are not valid').isEmail(),
    check('noHp', "Phone Number are not valid").isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.render('update-employe', {
            title: 'Update Employe Data Form',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            data: req.body,
        })
    } else {
        Data.updateOne(
        { _id: req.body._id},
        {
            $set: {
                noHp: req.body.noHp,
                email: req.body.email,
                jenis_kelamin: req.body.jenis_kelamin,
                tanggal_lahir: req.body.tanggal_lahir,
                alamat: req.body.alamat,
                status_pernikahan: req.body.status_pernikahan,
                status_karyawan: req.body.status_karyawan,
                posisi: req.body.posisi
            },
        }
        ).then()
        req.flash('msg', 'Update Employe Data Is Succesfully')
        res.redirect('/employ')
    }
})