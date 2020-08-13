const percentageKeywordMap = {
  end: 1.0,
  half: 0.5,
  quarter: 0.25,
  start: 0.0,
};

export default {
  mounted() {
    // Hides all elements marked as animatable
    this.$el.querySelectorAll("[data-animate]").forEach((el) => {
      el.style.opacity = 0;
    });
  },

  methods: {
    animate(animationClass, options = {}) {
      const delay = options.delay || 0;

      const classes = ["animated", animationClass];
      options.easing && classes.push("easing-" + options.easing);
      options.duration && classes.push("duration-" + options.duration);

      return function (el) {
        setTimeout(() => {
          el.classList.add(...classes);
          // Shows the element now that the animation is starting
          el.style.opacity = "";
        }, delay);
      };
    },
    animateIn(animationClass, options = {}) {
      return this.animate(animationClass, { easing: "decelerate", ...options });
    },
    animateOut(animationClass, options = {}) {
      return this.animate(animationClass, { easing: "accelerate", ...options });
    },
    // v-intersection helpers
    whenPastPercentage(percentage, intersectionHandler) {
      return {
        handler: function (entry) {
          entry.isIntersecting && intersectionHandler(entry.target);
        },
        cfg: { threshold: percentage },
      };
    },
    whenPastEnd(intersectionHandler) {
      return this.whenPastPercentage(1, intersectionHandler);
    },
    whenPastHalf(intersectionHandler) {
      return this.whenPastPercentage(0.5, intersectionHandler);
    },
    whenPastQuarter(intersectionHandler) {
      return this.whenPastPercentage(0.25, intersectionHandler);
    },
    whenPastStart(intersectionHandler) {
      return this.whenPastPercentage(0.0, intersectionHandler);
    },
    whenPast(percentageOrKeyword, intersectionHandler) {
      if (
        typeof percentageOrKeyword !== "number" &&
        typeof percentageOrKeyword !== "string"
      ) {
        throw new Error("A keyword or percentage must be provided");
      }

      if (
        typeof percentageOrKeyword === "string" &&
        !Object.keys(percentageKeywordMap).includes(percentageOrKeyword)
      ) {
        throw new Error(
          "Keyword must be one between " +
            Object.keys(percentageKeywordMap).join(", ")
        );
      }

      const percentage =
        typeof percentageOrKeyword === "string"
          ? percentageKeywordMap[percentageOrKeyword]
          : percentageOrKeyword;

      return this.whenPastPercentage(percentage, intersectionHandler);
    },
  },
};
