const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const mainRoute = require("./routes/main");
const scheduleRoute = require("./routes/schedule");
const episodeRoute = require("./routes/anify/episodes");
const sourceRoute = require("./routes/anify/sources");

const consumetEpisodeRoute = require("./routes/consumet/episode");
const consumetSourceRoute = require("./routes/consumet/source");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 50, // limit each IP to 50 requests per windowMs
});

app.use(limiter);
app.set("trust proxy", 1);

const whitelist = [
  "https://beta.moopa.live",
  "https://demo.moopa.live",
  "https://ruka.moopa.live",
  "https://moopa.live",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors());

app.use("/", mainRoute);
app.use("/api/schedules", scheduleRoute);
app.use("/anify/episode", episodeRoute);
app.use("/anify/source", sourceRoute);

app.use("/consumet/episode", consumetEpisodeRoute);
app.use("/consumet/source", consumetSourceRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
