var express = require("express");
var podRouter = express.Router();
var db = require("../lib/database");
var helper = require("../core/helper");
const ACCESSTOKEN = "AccessToken";
let podcast = {};

podcast.getAll = async (req, res) => {
  var podcasts;

  let promise = helper.paramValidate({ code: 2010, val: "" });

  promise
    .then(async () => {
      return await db._find("podcasts", {});
    })
    .then((p) => {
      podcasts = p;
      if (!podcasts) {
        return Promise.reject(403);
      }
    })
    .then(() => helper.success(res, { podcasts }))
    .catch((e) => {
      helper.error(res, e);
    });
};

podcast.getPodcast = async (req, res) => {
  const { id } = req.params;
  const { param1 } = req.query;
  var details;

  let promise = helper.paramValidate({ code: 2010, val: !id });

  promise
    .then(async () => {
      if (param1) {
        return await db._find(param1.toLowerCase(), { _id: id });
      } else {
        return await db._find("podcasts", { _id: id });
      }
    })
    .then((p) => {
      details = p[0];
      if (!details) {
        return Promise.reject(1001);
      }
    })
    .then(() => helper.success(res, { details }))
    .catch((e) => {
      helper.error(res, e);
    });
};

podcast.likePodcast = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.uSession;
  var details;
  var liked;
  let promise = helper.paramValidate(
    { code: 2010, val: !id },
    { code: 2010, val: !userId }
  );

  promise

    .then(async () => {
      return await db._find("podcasts", { _id: id });
    })
    .then((p) => {
      details = p[0];
      if (!details) {
        return Promise.reject(403);
      }
    })
    .then(async () => {
      return await db._find("likes", { podcastId: id, userId });
    })
    .then(async (l) => {
      if (l.length > 0) {
        liked = l[0];
        await db.delete("likes", { podcastId: id, userId });
      } else {
        return await db.insert("likes", {
          podcastId: id,
          userId,
          status: "Liked",
        });
      }
    })
    .then((insertId) => {
      helper.success(res, { details });
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

podcast.userLikedPodcasts = async (req, res) => {
  const { userId } = req.uSession;
  var likes;

  let promise = helper.paramValidate({ code: 2010, val: !userId });

  promise
    .then(async () => {
      return await db._find("likes", { userId });
    })
    .then((p) => {
      likes = p;
      if (!likes) {
        return Promise.reject(403);
      }
    })
    .then(() => {
      helper.success(res, { likes });
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

podcast.userFavourites = async (req, res) => {
  const { userId } = req.uSession;
  var likes;
  var results;
  let promise = helper.paramValidate({ code: 2010, val: !userId });

  promise
    .then(async () => {
      return await db._find("likes", { userId });
    })
    .then(async (p) => {
      likes = p;
      if (!likes) {
        return Promise.reject(403);
      }
      const podcastIds = likes.map((like) => like.podcastId);
      results = await db.find("podcasts", { _id: { $in: podcastIds } });
    })
    .then(() => {
      helper.success(res, { results });
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

podcast.getCategory = async (req, res) => {
  const { userId } = req.uSession;
  const { category } = req.params;
  var results;
  let promise = helper.paramValidate({ code: 2010, val: !userId });

  promise
    .then(async () => {
      return await db._find(category.toLowerCase(), {});
    })
    .then(async (p) => {
      results = p;
      if (results.length < 0) {
        return Promise.reject(403);
      }
    })
    .then(() => {
      helper.success(res, { results });
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

podcast.searchPodcast = async (req, res) => {
  const { userId } = req.uSession;
  const { search } = req.params;
  var results;
  let promise = helper.paramValidate(
    { code: 2010, val: !userId },
    { code: 2010, val: !search }
  );

  promise
    .then(async () => {
      const searchRegex = new RegExp(search, "i");
      return await db._find("podcasts", {
        $or: [
          { name: { $regex: searchRegex } },
          { "podcast.name": { $regex: searchRegex } },
        ],
      });
    })
    .then(async (p) => {
      results = p;
      if (results.length < 0) {
        return Promise.reject(403);
      }
    })
    .then(() => {
      helper.success(res, { results });
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

module.exports = function (app, uri) {
  podRouter.get("/", podcast.getAll);
  podRouter.get("/:id", podcast.getPodcast);
  podRouter.get("/search/:search", podcast.searchPodcast);
  podRouter.get("/details/:id", podcast.getPodcast);
  podRouter.get("/like/:id", podcast.likePodcast);
  podRouter.get("/user/likes", podcast.userLikedPodcasts);
  podRouter.get("/user/favourites", podcast.userFavourites);
  podRouter.get("/category/:category", podcast.getCategory);
  app.use(uri, podRouter);
};
