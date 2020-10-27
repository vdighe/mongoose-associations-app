const router = require('express').Router();
const User = require('../models/user').User;
const Tweet = require('../models/user').Tweet;


// ROUTES
router.get('/:userId/tweets/:tweetId/edit', (req,res) => {
    const userId = req.params.userId;
    const tweetId = req.params.tweetId;
    User.findById(userId, (err, foundUser) => {
        const foundTweet = foundUser.tweets.id(tweetId);
        res.render('tweets/edit.ejs', {foundUser, foundTweet})
    });
});

// DELETE
router.delete('/:userId', (req, res) => {
    const index = req.params.userId;
    User.findByIdAndRemove(index, (error) => {
        res.redirect('/users');
    });
});

/*
//UPDATE USER USING PUT
// http://localhost:3000/users/5f96f7746903574a9b725ded/edit?
router.put('/:userId', (req, res) => {
    console.log(`{req.params.userId}`);
    User.findByIdAndUpdate(req.params.userId, req.body, (error) => {
        res.redirect('/users');
    } )

})
*/
router.get('/:userId/edit', (req, res) => {
    User.findById(req.params.userId, (err, foundUser) => {
        res.render('edit.ejs', {
            user :foundUser
        });
    });
});

// UPDATE TWEET  USING PUT
//http://localhost:3000/users/5f96f8d1b163854abcc062f2/tweets/5f9725d2c911185640712045?_method=PUT
router.put('/:userId/tweets/:tweetId', (req, res) => {
    console.log('PUT ROUTE');
    const userId = req.params.userId;
    const tweetId = req.params.tweetId;
    User.findById(userId, (err, foundUser) => {
        const foundTweet = foundUser.tweets.id(tweetId);
        foundTweet.tweetText = req.body.tweetText;
        foundUser.save((err, savedUser) => {
            res.redirect(`/users/${foundUser.id}`);
        });
    });    
});

router.delete('/:userId/tweets/:tweetId', (req, res) => {
    console.log('DELETE TWEET');
    // set the value of the user and tweet ids
    const userId = req.params.userId;
    const tweetId = req.params.tweetId;
  
    // find user in db by id
    User.findById(userId, (err, foundUser) => {
      // find tweet embedded in user
      foundUser.tweets.id(tweetId).remove();
      // update tweet text and completed with data from request body
      foundUser.save((err, savedUser) => {
        res.redirect(`/users/${foundUser.id}`);
      });
    });
  });

router.get('/' , (req, res) => {
    User.find(({}, (error, users) => {
        res.render('users/index.ejs', {
            users });
    }));
});
// New user form
router.get('/new', (req,res) => {
    res.render('users/new.ejs');
});

router.post('/:userId/tweets', (req, res) => {
    console.log(req.body);
    const newTweet = new Tweet({tweetText : req.body.tweetText});
    // Find User Id
    User.findById(req.params.userId, (error, user) => {
        user.tweets.push(newTweet);
        user.save((err, user) => {
            res.redirect(`/users/${user.id}`);
        });
    });
});

router.post('/', (req,res) => {
    User.create(req.body, (error, newUser)=>{
        res.redirect(`/users/${newUser.id}`);
    });
});
// Show user
router.get('/:userId', (req,res) => {
    User.findById(req.params.userId, (error, user) =>{
        res.render('users/show.ejs', {user});
    });
});
module.exports = router;