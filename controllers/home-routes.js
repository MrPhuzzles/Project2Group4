const router = require("express").Router();
const { User, Post, Reviews, Rel } = require("../models");

router.get("/", (req, res) => {
  Post.findAll({
    where: {
        request_taken: false
    },
    attributes: ["id","title", "content", "created_at", ],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const post = dbPostData.map((post) => post.get({ plain: true }));

      res.render("homepage", { post, loggedIn: req.session.loggedIn});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where:{
            id:req.params.id
        },
        attributes: ["id","title", "content", "created_at", "address", "city", "province", "postal"],
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      })
      .then (dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
          }
        const post = dbPostData.get({plain:true});

        res.render('post', {post, loggedIn: req.session.loggedIn})
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      })
})

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

module.exports = router;
