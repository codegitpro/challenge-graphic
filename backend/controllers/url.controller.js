const Url = require('../models/url.model');
const httpStatus = require('http-status');
const validUrl = require('valid-url');

exports.shorten = async(req, res, next) => {
  const { url: originalUrl } = req.body;

  if (!originalUrl) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, msg: "Data missing!", data: req.body });
  } else if (!validUrl.isUri(originalUrl)) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, msg: "Invalid Original Url!", data: req.body });
  }
  console.log(req.session.urls);
  try {
    // Create a url object

    let existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      let urls = req.session.urls || [];
      req.session.urls = [existingUrl, ...urls.filter(e => e.originalUrl != originalUrl)];
      return res.json({ success: true, data: existingUrl });
    }

    let urlCode = await Url.generateUniqueCode();
    let url = new Url({ originalUrl, urlCode });

    await url.save();
    req.session.urls = [url, ...(req.session.urls || [])];
    return res.json({ success: true, data: url });

  } catch (error) {
    return next(error);
  }
}

exports.get = async(req, res, next) => {
  try {
    let url = await Url.findOne({ urlCode: req.params.id });
    if (!url) {
      return res.status(httpStatus.NOT_FOUND).json({ success: false, msg: "Url not exist!" });
    }
    return res.json(url);
  } catch (error) {
    return next(error);
  }
}

exports.list = (req, res, next) => {
  console.log(req.session.id);
  return res.json({ success: true, data: req.session.urls });
}

exports.redirect = async(req, res, next) => {
  console.log(req.params);
  try {
    const urlCode = req.params.id;
    const url = await Url.findOne({ urlCode: urlCode });
    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      console.log('404');
      return res.status(httpStatus.NOT_FOUND).send('<h2>This is 404 error</h2><p>Url requested not found</p>');
    }
    
  } catch (error) {
    return next(error);
  }
}