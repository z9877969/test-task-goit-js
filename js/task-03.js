const body = document.querySelector("body");
const taskThree = document.createElement("div");
taskThree.setAttribute("id", "task-03");
body.append(taskThree);

// do task
const createDomElement = ({
  tagName,
  classNameArr,
  atributesObj,
  dataAtributesArr,
  content,
}) => {
  const element = document.createElement(tagName);

  if (classNameArr) {
    element.classList.add(...classNameArr);
  }

  if (atributesObj) {
    Object.entries(atributesObj).forEach((atribute) => {
      const [atributeKey, atributeValue] = atribute;
      element.setAttribute(atributeKey, atributeValue);
    });

    if (dataAtributesArr) {
      const [dataKey, dataValue] = dataAtributesArr;
      element.dataset[dataKey] = dataValue;
    }
  }

  if (content) {
    element.textContent = content;
  }

  return element;
};

// ===form
const setForm = {
  tagName: "form",
  atributesObj: {
    id: "search-form",
    style: "position: fixed",
  },
};
const form = createDomElement(setForm);
taskThree.append(form);

// =input
const setInput = {
  tagName: "input",
  atributesObj: {
    type: "text",
    name: "query",
    autocomplete: "off",
    placeholder: "Search images...",
  },
};
const input = createDomElement(setInput);
form.append(input);

// ===list
const list = document.createElement("ul");
list.setAttribute("style", "list-style: none; padding-top: 30px");

// =item wrapper
const getItem = (imgSmallUrl, imgLargeUrl, imgDescr) => {
  //  ===item
  const item = document.createElement("li");

  // =link
  const link = document.createElement("a");
  link.setAttribute("href", `${imgLargeUrl}`);
  item.append(link);

  // =img
  const imgSet = {
    tagName: "img",
    atributesObj: {
      src: `${imgSmallUrl}`,
      alt: `${imgDescr}`,
    },
    dataAtributesArr: ["source", imgLargeUrl],
  };
  const img = createDomElement(imgSet);
  link.append(img);

  return item;
};

const getImgData = (data) => {
  const imgData = [...data].map((el) => ({
    smallImg: el.webformatURL,
    largeImg: el.largeImageURL,
    descr: `${el.type} ${
      [...el.tags.split(",")].find((el) => el.split(" ").length > 1)
        ? [...el.tags.split(",")].find((el) => el.split(" ").length > 1).trim()
        : el.tags.split(",")[0].trim()
    }`,
  }));

  return imgData;
};

const URL = "https://pixabay.com/api/?key=13965574-3ae6669f35304ffc6cddc1b72";

let query = "";
let page = 0;
let per_page = 20;
let node;

const fetchPictureList = (query, page, per_page) => {
  if (query) {
    fetch(`${URL}&q=${query}&page=${page}&per_page=${per_page}`)
      .then((res) => res.json())
      .then((query) => query.hits)
      .then((data) => getImgData(data))
      .then((imgs) => {
        taskThree.append(list);
        [...imgs].map((img) => {
          const { smallImg, largeImg, descr } = img;
          const item = getItem(smallImg, largeImg, descr);
          list.append(item);
        });
      })
      .then(() => {
        node = document.querySelector("li:last-child img");
        node.onload = function () {
          handlerAutoScroll();
        };
      })
      .catch((err) =>
        taskThree.insertAdjacentHTML(
          "beforeend",
          `<p id="err">${err}... Try again</p>`
        )
      );
  }
};

// handlers
const handlerSubmit = (e) => {
  e.preventDefault();

  const errEl = document.querySelector("#err");
  errEl && errEl.remove();

  query = input.value;
  page = 1;

  if (list) {
    list.innerHTML = "";
  }

  fetchPictureList(query, page, per_page);
};

const handlerAutoScroll = () => {
  const options = {
    root: null,
    rootMargin: "0px ",
    threshold: 0.1,
  };

  const target = node;

  const callback = (entries, observer) => {
    entries.forEach((entry, arr) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        page++;
        fetchPictureList(query, page, per_page);
      }
    });
  };
  const observer = new IntersectionObserver(callback, options);
  observer.observe(target);
};

// const handlerDisplayForm = () => {
//   const options = {
//     root: null,
//     rootMargin: "0px ",
//     threshold: 0.1,
//   };

// //   const target = node;

//   const callback = (entries, observer) => {
//     entries.forEach((entry, arr) => {
//       if (entry.isIntersecting) {
//         observer.unobserve(entry.target);
//         page++;
//       }
//     });
//   };
//   const observer = new IntersectionObserver(callback, options);
//   observer.observe(target);
// };

// listeners
form.addEventListener("submit", handlerSubmit);
