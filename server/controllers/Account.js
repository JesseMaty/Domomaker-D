const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
};

const logout = (req, res) => {
    req.session.destroy(); // Destroys the session on logout
    return res.redirect('/'); // Redirects to login page
}

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    // Ensure fields are filled out
    if(!username || !pass){
        return res.status(400).json({error: 'All fields are required!'});
    }

    // Authenticates password through account controller.
    return Account.authenticate(username, pass, (err, account) => {
        if(err || !account){
            return res.status(401).json({error: 'Wrong username or password!'});
        };

        req.session.account = Account.toAPI(account);

        // If account exists, login and redirect to maker page
        return res.json({redirect: '/maker'});
    })
};

const signup = async (req, res) => {
    // Validate the data
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    // Make sure all form data is filled
    if (!username || !pass || !pass2){
        return res.status(400).json({error: 'All fields are required!'});
    }
    
    // Make sure pass1 = pass2
    if(pass != pass2){
        return res.status(400).json({error: 'Passwords do not match!'});
    }

    // Attempt to hash the password and save the new account to db
    try{
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({username, password: hash});
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);

        // Redirect to maker page on successful account creation
        return res.json({redirect: '/maker'})
    } catch (err){
        console.log(err);

        // Error code 11000 is mongo's "duplicate entry" error.
        if(err.code === 11000){
            return res.status(400).json({ error: 'Username already in use!'});
        }

        // Otherwise send a generic error message to client
        return res.status(500).json({error: 'An error occured!'});
    }
};

module.exports = {
    loginPage,
    logout,
    login,
    signup,
};