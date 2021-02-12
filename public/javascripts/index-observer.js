const showcase = document.querySelector(".introductory-text");

const options = {
  root: null,
  threshold: 0,
};

const observer = new IntersectionObserver(function
  (entries, observer){
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    })
}, options);

observer.observe(showcase);