import userModel from '../models/user.models.js';

export const showLogin = (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('login');
    }
};

export const showRegister = (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('register');
    }
};

export const postRegister = async (req, res) => {
    const { email, password, fullname, age } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.render('register', { error: 'El correo electrónico ya está registrado' });
    }

    const user = new userModel({ email, password, fullname, age });
    await user.save();

    req.session.user = user;
    res.redirect('/');
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).exec();
    if (user && password === user.password) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }
};

export const getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.redirect('/users/profile');
        }

        res.clearCookie(req.app.get('cookieName'));
        res.redirect('/');
    });
};
