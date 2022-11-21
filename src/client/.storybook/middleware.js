// see https://github.com/storybookjs/storybook/issues/6762#issuecomment-498246681
// and https://expressjs.com/en/4x/api.html#res.redirect

module.exports = (router) => {
  router.get("/", (req, res) => {
    res.redirect("/storybook/")
  })
}
