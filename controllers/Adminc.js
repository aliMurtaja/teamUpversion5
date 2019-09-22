const path = require('path');
var express = require('express');
var router = express.Router();
var appRoot = require('app-root-path');
const { check, validationResult } = require('express-validator');
// const { matchedData, sanitize } = require('express-validator');
// var admin = require('../Model/Adminm');
var db = require('./../config');
var csrf = require('csurf');
var csrfProtection = csrf();
// var async = require('asyncawait');
// var await = require('asyncawait');


//murtajaali10@gmail.com
//AIMS123 

// for protect the all route
router.use(csrfProtection);

router.get('/', (req, res, next) => {
    res.render('layout/login', { ali: "this is ali", csrfToken: req.csrfToken() })
})

router.post('/post_custome_login',   [
    check('email', 'Err Ocurre In User email').trim().isEmail().normalizeEmail(),
    check('password', 'Err Ocurre In User password').trim().isLength({ min: 5 }),
], (req, res, next) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.mapped());
        return res.render('layout/login', { "errors": errors.mapped() });
    } else {

        let email = req.body.email;
        let password = req.body.password;

        db.qb.select(['t_tuuser.TUUSER_KID', 't_tuuser.TUUSER_NAME'])
            .where({TUUSER_EMAILID: email, TUUSER_PASSWORD: password })
            .get('t_tuuser', (err, response)=>{
                
                if(response.length > 0){
                    
                    let sessionsVariable = { USER_LOGINNAME: response[0].TUUSER_NAME, T_USERID: response[0].TUUSER_KID  }
                    req.session.sessions = sessionsVariable;
                   
                    console.log(response);
                    return res.redirect('/dashbord');
                    // res.render('layout/index',{varis: "this is variable"});
                }else{
                    return res.render('layout/login', { "Invalid": "Invalid Credentials" });
                }
                
            });

    }

})

// router.get('/dashbord' , (req, res, next)=>{

    // let data = [];
    function getMenuSubMenu(req, res, next){ 
        // to get the menu and submenu
        db.qb.select(['t_menu.MENU_KID', 't_menu.MENU_NAME', 't_menu.MENU_CODE', 't_menu.SEQ'])
            .order_by('t_menu.SEQ')
            .get('t_menu', (err, response) => {
                
                if (err) return console.error("Uh oh! Couldn't get results: " + err.msg);

                let data = [];

                data['menu'] = response;

                let lenth = data['menu'].length;

                data['menu'].map((men) => {

                    db.qb.select(['t_submenu.SUBMENU_KID', 't_submenu.SUBMENU_NAME', 't_submenu.SUBMENU_URL'])
                        .order_by('t_submenu.SEQ')
                        .where({ SUBMENU_MENUID: men.MENU_KID })
                        .get('t_submenu', (err, response) => {
                            men.sub = response
                            lenth--;

                    })

                })

                req.menuSubMenu = data['menu'];
                return next()

            });
        }        


    function getMenuSubMenuAccess(req, res, next){ 
        // to get the menu and submenu of the user Access Right
        db.qb.select(['t_menu.MENU_KID', 't_menu.MENU_NAME', 't_menu.MENU_CODE', 't_menu.SEQ'])
        .order_by('t_menu.SEQ')
        .where({MENU_TYPEAN: 'N'})
        .get('t_menu', (err, response) => {
            
            if (err) return console.error("Uh oh! Couldn't get results: " + err.msg);
            
            let data = [];

            data['userAccessMenu'] = response;

            let lenth = data['userAccessMenu'].length;

            data['userAccessMenu'].map((men) => {

                db.qb.select(['t_submenu.SUBMENU_KID', 't_submenu.SUBMENU_NAME', 't_submenu.SUBMENU_URL'])
                    .order_by('t_submenu.SEQ')
                    .where({ SUBMENU_MENUID: men.MENU_KID, SUBMENU_TYPEAN: 'N' })
                    .get('t_submenu', (err, response) => {
                        
                        men.sub = response
                        lenth--;
                //    console.log(data)     

                })

            })
                req.menuSubMenuAccess = data['userAccessMenu'];
                return next()

        });
    }

    function renderDashboard(req, res, next){
        let datas ={
            menuSub: req.menuSubMenu,
            menuSubMenuAccess: req.menuSubMenuAccess
        }

        console.log(datas)
        res.render('layout/index', {
            menuSub: req.menuSubMenu,
            menuSubMenuAccess: req.menuSubMenuAccess
        })

    }

// });

router.get('/dashbord', getMenuSubMenu, getMenuSubMenuAccess, renderDashboard );



// to give the all productsxxx
router.get('/kjk', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    // admin.Admin.find('all', function(err, rows, fields) {
    //   console.log(rows)
    // });
    // res.sendFile(path.join(appRoot.path, 'data', 'product.json'))
    // console.log(res.sendFile(path.join(__dirname, 'data', 'product.json')))
    // console.log(appRoot.path)
    // res.end()

    db.qb.select(['t_menu.MENU_KID', 't_menu.MENU_NAME', 't_menu.MENU_CODE', 't_menu.SEQ'])
        .order_by('t_menu.SEQ')
        // .where({type: 'rocky', 'diameter <': 12000})
        .get('t_menu', (err, response) => {
            // db.qb.disconnect();

            if (err) return console.error("Uh oh! Couldn't get results: " + err.msg);

            // SELECT `name`, `position` FROM `planets` WHERE `type` = 'rocky' AND `diameter` < 12000
            console.log("Query Ran: " + db.qb.last_query());

            let data = [];
            data['menu'] = response;

            let lenth = data['menu'].length;

            data['menu'].map((men) => {

                db.qb.select(['t_submenu.SUBMENU_KID', 't_submenu.SUBMENU_NAME', 't_submenu.SUBMENU_URL'])
                    .order_by('t_submenu.SEQ')
                    .where({ SUBMENU_MENUID: men.MENU_KID })
                    .get('t_submenu', (err, response) => {
                        men.sub = response
                        lenth--;
                        // console.log(lenth)
                        if (lenth <= 0) {
                            res.status(200).json({
                                count: response.length,
                                menuSub: data['menu'],

                            })
                            res.end()
                            console.log('one')
                        }
                        // console.log(res)

                    })

            })

        });
});




router.post('/login', (req, res) => {
    res.setHeader("Content-Type", 'application/json');
    let password = req.body.password;
    let email = req.body.email;
    db.db.MyAppModel.connection.connect((err) => {
            if (err) throw err
            db.db.MyAppModel.query(`SELECT * FROM t_user where USER_LOGINNAME = '${email}' and USER_PASSWORD = '${password}' `)
                .then((result) => {
                    // console.log(result[0].USER_KID)
                    // console.log(result[0])
                    if (result[0] !== undefined) {
                        // console.log("not defiend")
                        res.status(200)
                        res.send(result);
                        res.end()
                    } else {
                        res.status(404)
                        res.send({
                            message: 'invalid credentials'
                        })
                    }
                    res.end()
                })
                .catch((error) => {
                    console.log(error);
                    res.status.json({
                        error
                    })
                })
        })
        // console.log(db.db.MyAppModel.connection.connect)
        // console.log(db.db.MyAppModel.query)
        // console.log("ali")
})


// function fun(a){


// }

module.exports = router;