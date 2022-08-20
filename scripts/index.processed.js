import React, { useState, useEffect } from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import { Link, Outlet, BrowserRouter, Routes, Route, useParams } from 'https://cdn.skypack.dev/react-router-dom';
import { atom, RecoilRoot, useRecoilState, useRecoilValue } from 'https://cdn.skypack.dev/recoil';

const appSelectionState = atom({
  key: 'appSelectionState',
  default: "explore"
});
const appPageState = atom({
  key: 'appPageState',
  default: "home"
});
atom({
  key: 'postsScrollState',
  default: "false"
});

const storedPosts = atom({
  key: 'storedPosts',
  default: []
});
const storedPurchases = atom({
  key: 'storedPurchases',
  default: []
});
const storedWishlist = atom({
  key: 'storedWishlist',
  default: []
});
const storedUploads = atom({
  key: 'storedUploads',
  default: []
});
atom({
  key: 'storedCourses',
  default: []
});
atom({
  key: 'storedCollections',
  default: []
});
const storedFollowing = atom({
  key: 'storedFollowing',
  default: []
});

const urlApi = "https://piwebinarsdev.herokuapp.com"; //saving arrays to session storage

Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key));
};

const filter = input => {
  let value = input.toLowerCase();
  let x = document.querySelectorAll(".post");

  for (let i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(value)) {
      x[i].style.display = "none";
    } else x[i].style.display = "block";
  }
}; //getting webinars


const renderWebinars = async () => {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
};

async function renderMore() {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/more`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
}

async function renderUploads() {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
}

async function renderCreator(userId) {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/creator/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  console.log("creator", webinarUploads);
  return webinarUploads;
}

async function renderPurchases() {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/purchases`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
}

async function renderWishlist() {
  const auth_token = localStorage.getItem("userSession");
  const webinarUploads = await axios.get(`${urlApi}/post/wishlist`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return webinarUploads;
}

async function addWishlist$1(props) {
  if (!localStorage.userSession) {
    alert("Please login to add webinar to your wishlist.");
  }

  const config = {
    post: props
  };
  const auth_token = localStorage.getItem("userSession");
  const response = await axios.post(`${urlApi}/post/addWishlist`, config, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return response;
}

async function renderFollowing() {
  const auth_token = localStorage.getItem("userSession");
  const profile = await axios.get(`${urlApi}/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`
    }
  });
  return profile;
}

var _br$2, _br2$2, _br3$2, _br4$2, _br5$1, _br6$1, _br7$1, _br8$1, _br9$1, _br10$1, _br11$1, _br12$1, _br13$1, _br14$1, _br15$1, _br16$1, _br17$1, _br18$1, _br19$1, _br20$1, _br21, _br22, _br23, _br24, _br25, _br26, _br27, _br28, _br29, _br30, _br31, _br32, _br33, _br34, _br35, _br36, _br37, _br38, _br39, _br40, _br41, _br42, _br43, _br44, _br45, _div$3, _CategorySelection, _Following, _Help, _RecoilRoot$1, _span$2;

function NavTab(props) {
  const [page, setPage] = useRecoilState(appPageState);
  console.log(page);
  let classes = "navTab";
  let iClass = props.class;

  if (page == props.type) {
    classes = "navTab tabActive";
    iClass = `${props.class} iconActive`;
  } else {
    classes = "navTab tabInactive";
    iClass = `${props.class} iconInactive`;
  }

  const highlight = () => {
    setPage(`${props.type}`);
  };

  return /*#__PURE__*/React.createElement(RecoilRoot, null, /*#__PURE__*/React.createElement("span", {
    onClick: highlight
  }, /*#__PURE__*/React.createElement(Link, {
    to: props.href,
    className: classes,
    style: {
      textDecoration: 'none',
      color: 'white'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: iClass
  }), props.text)));
}

function CategorySelection() {
  useState();

  const handleClick = input => {
    filter(input);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "categoriesSelection",
    style: {
      zIndex: "5"
    },
    className: "popupNavContent"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('');
    },
    className: "filter categoryActive"
  }, "All"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Cryptocurrency');
    },
    className: "filter categoryInactive"
  }, "Cryptocurrency"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Pi Network');
    },
    className: "filter categoryInactive"
  }, "Pi Network"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Education');
    },
    className: "filter categoryInactive"
  }, "Education"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Finance');
    },
    className: "filter categoryInactive"
  }, "Finance"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Fitness');
    },
    className: "filter categoryInactive"
  }, "Fitness"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Food');
    },
    className: "filter categoryInactive"
  }, "Food"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('History');
    },
    className: "filter categoryInactive"
  }, "History"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Music');
    },
    className: "filter categoryInactive"
  }, "Music"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Pets');
    },
    className: "filter categoryInactive"
  }, "Pets"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Sports');
    },
    className: "filter categoryInactive"
  }, "Sports"), /*#__PURE__*/React.createElement("a", {
    onClick: () => {
      handleClick('Technology');
    },
    className: "filter categoryInactive"
  }, "Technology"), _br$2 || (_br$2 = /*#__PURE__*/React.createElement("br", null)), _br2$2 || (_br2$2 = /*#__PURE__*/React.createElement("br", null)), _br3$2 || (_br3$2 = /*#__PURE__*/React.createElement("br", null)), _br4$2 || (_br4$2 = /*#__PURE__*/React.createElement("br", null)), _br5$1 || (_br5$1 = /*#__PURE__*/React.createElement("br", null)), _br6$1 || (_br6$1 = /*#__PURE__*/React.createElement("br", null)), _br7$1 || (_br7$1 = /*#__PURE__*/React.createElement("br", null)), _br8$1 || (_br8$1 = /*#__PURE__*/React.createElement("br", null)), _br9$1 || (_br9$1 = /*#__PURE__*/React.createElement("br", null)), _br10$1 || (_br10$1 = /*#__PURE__*/React.createElement("br", null)), _br11$1 || (_br11$1 = /*#__PURE__*/React.createElement("br", null)), _br12$1 || (_br12$1 = /*#__PURE__*/React.createElement("br", null)), _br13$1 || (_br13$1 = /*#__PURE__*/React.createElement("br", null)), _br14$1 || (_br14$1 = /*#__PURE__*/React.createElement("br", null)), _br15$1 || (_br15$1 = /*#__PURE__*/React.createElement("br", null)), _br16$1 || (_br16$1 = /*#__PURE__*/React.createElement("br", null)), _br17$1 || (_br17$1 = /*#__PURE__*/React.createElement("br", null)), _br18$1 || (_br18$1 = /*#__PURE__*/React.createElement("br", null))));
}

function Following() {
  const [following, setFollowing] = useRecoilState(storedFollowing);
  useEffect(async () => {
    if (following.length == 0) {
      const list = await renderFollowing();
      console.log(list.data.profile.following);
      setFollowing(list.data.profile.following);
    }
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "popupNavContent",
    id: "followingList"
  }, following.map(user => {
    return /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement(Link, {
      to: `/user/${user.user}`,
      className: "followingName"
    }, user.handle), _br19$1 || (_br19$1 = /*#__PURE__*/React.createElement("br", null)), _br20$1 || (_br20$1 = /*#__PURE__*/React.createElement("br", null)));
  }), _br21 || (_br21 = /*#__PURE__*/React.createElement("br", null)), _br22 || (_br22 = /*#__PURE__*/React.createElement("br", null)), _br23 || (_br23 = /*#__PURE__*/React.createElement("br", null)), _br24 || (_br24 = /*#__PURE__*/React.createElement("br", null)), _br25 || (_br25 = /*#__PURE__*/React.createElement("br", null)), _br26 || (_br26 = /*#__PURE__*/React.createElement("br", null)), _br27 || (_br27 = /*#__PURE__*/React.createElement("br", null)), _br28 || (_br28 = /*#__PURE__*/React.createElement("br", null)), _br29 || (_br29 = /*#__PURE__*/React.createElement("br", null)), _br30 || (_br30 = /*#__PURE__*/React.createElement("br", null)), _br31 || (_br31 = /*#__PURE__*/React.createElement("br", null)), _br32 || (_br32 = /*#__PURE__*/React.createElement("br", null)), _br33 || (_br33 = /*#__PURE__*/React.createElement("br", null)), _br34 || (_br34 = /*#__PURE__*/React.createElement("br", null)), _br35 || (_br35 = /*#__PURE__*/React.createElement("br", null)), _br36 || (_br36 = /*#__PURE__*/React.createElement("br", null)), _br37 || (_br37 = /*#__PURE__*/React.createElement("br", null)), _br38 || (_br38 = /*#__PURE__*/React.createElement("br", null)), _br39 || (_br39 = /*#__PURE__*/React.createElement("br", null)), _br40 || (_br40 = /*#__PURE__*/React.createElement("br", null)), _br41 || (_br41 = /*#__PURE__*/React.createElement("br", null)), _br42 || (_br42 = /*#__PURE__*/React.createElement("br", null)), _br43 || (_br43 = /*#__PURE__*/React.createElement("br", null))));
}

function Help() {
  const darkMode = () => {// TODO
  };

  const translate = () => {
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en'
      }, 'google_translate');
    }

    googleTranslateElementInit();
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "popupNavContent"
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: "12px"
    },
    onClick: darkMode
  }, "Dark Mode |"), /*#__PURE__*/React.createElement("a", {
    id: "translate",
    onClick: translate,
    style: {
      fontSize: "12px",
      background: "none"
    }
  }, "Translate"), _br44 || (_br44 = /*#__PURE__*/React.createElement("br", null)), _br45 || (_br45 = /*#__PURE__*/React.createElement("br", null)), _div$3 || (_div$3 = /*#__PURE__*/React.createElement("div", {
    id: "google_translate"
  })), /*#__PURE__*/React.createElement("a", {
    style: {
      color: "#b44afb"
    }
  }, "Privacy |"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: "#b44afb"
    }
  }, "Terms |"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: "#b44afb"
    }
  }, "Contact")));
}

function Categories() {
  const [Active, setActive] = useState({
    stateA: 'true',
    arrowA: '⯅',
    stateB: 'false',
    arrowB: '⯆',
    stateC: 'false',
    arrowC: '⯆'
  });

  const updateStateA = () => {
    setActive({
      stateA: 'true',
      arrowA: '⯅',
      stateB: 'false',
      arrowB: '⯆',
      stateC: 'false',
      arrowC: '⯆'
    });
  };

  const updateStateB = () => {
    setActive({
      stateA: 'false',
      arrowA: '⯆',
      stateB: 'true',
      arrowB: '⯅',
      stateC: 'false',
      arrowC: '⯆'
    });
  };

  const updateStateC = () => {
    setActive({
      stateA: 'false',
      arrowA: '⯆',
      stateB: 'false',
      arrowB: '⯆',
      stateC: 'true',
      arrowC: '⯅'
    });
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "popupNav"
  }, /*#__PURE__*/React.createElement("h3", {
    onClick: updateStateA
  }, "Categories ", /*#__PURE__*/React.createElement("a", {
    style: {
      float: "right",
      paddingRight: "15px",
      cursor: "pointer"
    }
  }, Active.arrowA)), Active.stateA == 'true' && (_CategorySelection || (_CategorySelection = /*#__PURE__*/React.createElement(CategorySelection, null)))), /*#__PURE__*/React.createElement("div", {
    className: "popupNav"
  }, /*#__PURE__*/React.createElement("h3", {
    onClick: updateStateB
  }, "Following ", /*#__PURE__*/React.createElement("a", {
    style: {
      float: "right",
      paddingRight: "15px",
      cursor: "pointer"
    }
  }, Active.arrowB)), Active.stateB == 'true' && (_Following || (_Following = /*#__PURE__*/React.createElement(Following, null)))), /*#__PURE__*/React.createElement("div", {
    className: "popupNav"
  }, /*#__PURE__*/React.createElement("h3", {
    onClick: updateStateC
  }, "Help ", /*#__PURE__*/React.createElement("a", {
    style: {
      float: "right",
      paddingRight: "15px",
      cursor: "pointer"
    }
  }, Active.arrowC)), Active.stateC == 'true' && (_Help || (_Help = /*#__PURE__*/React.createElement(Help, null)))));
}

function Navigation() {
  return _RecoilRoot$1 || (_RecoilRoot$1 = /*#__PURE__*/React.createElement(RecoilRoot, null, /*#__PURE__*/React.createElement(NavTab, {
    text: "Dashboard",
    href: "/",
    class: "fas fa-home",
    type: "home"
  }), /*#__PURE__*/React.createElement(NavTab, {
    text: "Upload a Webinar",
    href: "upload",
    class: "fas fa-upload",
    type: "upload"
  }), /*#__PURE__*/React.createElement(NavTab, {
    text: "My Wishlist",
    href: "wishlist",
    class: "fas fa-heart",
    type: "wishlist"
  }), /*#__PURE__*/React.createElement(NavTab, {
    text: "My Profile",
    href: "profile",
    class: "fas fa-user",
    type: "profile"
  })));
}

class Nav extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, _span$2 || (_span$2 = /*#__PURE__*/React.createElement("span", {
      id: "nav"
    }, /*#__PURE__*/React.createElement("img", {
      id: "logoText",
      src: "/img/logo-text.png"
    }), /*#__PURE__*/React.createElement(Navigation, null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Categories, null))));
  }

}

var _Nav, _Outlet;

const Layout = () => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, _Nav || (_Nav = /*#__PURE__*/React.createElement(Nav, null)), _Outlet || (_Outlet = /*#__PURE__*/React.createElement(Outlet, null)));
};

function Selection() {
  const [selectionState, setSelectionState] = useRecoilState(appSelectionState);
  const [Active, setActive] = useState({
    stateA: 'selectionTabActive',
    stateB: 'selectionTabInactive',
    stateC: 'selectionTabInactive',
    stateD: 'selectionTabInactive',
    stateE: 'selectionTabInactive'
  });

  const updateStateA = () => {
    setActive({
      stateA: 'selectionTabActive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabInactive'
    });
    setSelectionState("explore");
  };

  const updateStateB = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabActive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabInactive'
    });
    setSelectionState("purchases");
  };

  const updateStateC = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabActive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabInactive'
    });
    setSelectionState("uploads");
  };

  const updateStateD = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabActive',
      stateE: 'selectionTabInactive'
    });
    setSelectionState("courses");
  };

  const updateStateE = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabActive'
    });
    setSelectionState("collections");
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "selectionTabs"
  }, /*#__PURE__*/React.createElement("a", {
    className: Active.stateA,
    onClick: updateStateA
  }, "Explore"), /*#__PURE__*/React.createElement("a", {
    className: Active.stateB,
    onClick: updateStateB
  }, "Purchases"), /*#__PURE__*/React.createElement("a", {
    className: Active.stateC,
    onClick: updateStateC
  }, "Uploads"), /*#__PURE__*/React.createElement("a", {
    className: Active.stateD,
    onClick: updateStateD
  }, "Courses"), /*#__PURE__*/React.createElement("a", {
    className: Active.stateE,
    onClick: updateStateE
  }, "Collections")));
}

var _div$2, _img$2;
function Cinema(props) {
  useEffect(() => {
    console.log(props.post.date);

    function close(e) {
      if (!document.querySelector("#cinema").contains(e.target)) {
        props.close();
      }
    }

    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    };
  }, []);
  useEffect(() => {
    const url = "https://player.vimeo.com/video/" + props.post.video_id;
    var options = {
      url: url,
      controls: true,
      width: 500,
      height: 500
    };
    var videoPlayer = new Vimeo.Player('Video', options);
    setInterval(function () {
      videoPlayer.on('timeupdate', function (getAll) {
        let currentPos = getAll.seconds;

        if (currentPos >= 30) {
          videoPlayer.pause();
          videoPlayer.setCurrentTime(0); // const payTimeout = setTimeout(endPreview, 1000);
        }
      });
    }, 1000);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "cinema"
  }, _div$2 || (_div$2 = /*#__PURE__*/React.createElement("div", {
    id: "Video"
  })), /*#__PURE__*/React.createElement("h2", null, props.post.title), /*#__PURE__*/React.createElement("p4", null, props.post.description), props.post.likes !== undefined && /*#__PURE__*/React.createElement("p", {
    id: "likes"
  }, "Likes: ", props.post.likes), props.post.dislikes !== undefined && /*#__PURE__*/React.createElement("p", {
    id: "dislikes"
  }, "Dislikes: ", props.post.dislikes), /*#__PURE__*/React.createElement("p", {
    id: "category"
  }, props.post.category), props.post.date !== undefined && /*#__PURE__*/React.createElement("p", {
    id: "date"
  }, props.post.date.substring(0, 10)), /*#__PURE__*/React.createElement("div", {
    id: "creatorProfile"
  }, props.post.avatar ? /*#__PURE__*/React.createElement("img", {
    id: "avatar",
    src: props.post.avatar
  }) : _img$2 || (_img$2 = /*#__PURE__*/React.createElement("img", {
    id: "avatar",
    src: "https://piwebinars.co.uk/img/avatar.png"
  })), /*#__PURE__*/React.createElement("p", {
    id: "name"
  }, props.post.name))));
}

var _div$1;
function Loader() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, _div$1 || (_div$1 = /*#__PURE__*/React.createElement("div", {
    id: "html-spinner"
  })));
}

var _Loader$5;
function Post$4(props) {
  const [modalShown, toggleModal] = useState(false);
  const [isWishlist, setWishlist] = useState(false);
  useEffect(() => {
    if (props.wishlisted == true) {
      setWishlist(true);
    }
  }, []);

  const open = () => {
    toggleModal(!modalShown);
  };

  const add = async () => {
    setWishlist(!isWishlist);
    await addWishlist$1(props);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "post"
  }, /*#__PURE__*/React.createElement("img", {
    onClick: open,
    className: "postThumbnail",
    src: `https://vumbnail.com/${props.video_id}.jpg`
  }), /*#__PURE__*/React.createElement("h3", {
    className: "postTitle"
  }, props.title), /*#__PURE__*/React.createElement("div", {
    className: "statDiv"
  }, /*#__PURE__*/React.createElement(Link, {
    to: `/user/${props.user_id}`,
    className: "statName"
  }, props.name), /*#__PURE__*/React.createElement("p2", {
    className: "statCategory"
  }, props.category), /*#__PURE__*/React.createElement("p2", {
    className: "statLikes"
  }, props.likes, " likes")), isWishlist == false ? /*#__PURE__*/React.createElement("i", {
    onClick: add,
    className: "fas fa-plus addWishlist"
  }) : /*#__PURE__*/React.createElement("i", {
    onClick: add,
    className: "fas fa-minus addWishlist"
  })), modalShown ? /*#__PURE__*/React.createElement(Cinema, {
    close: () => {
      toggleModal(!modalShown);
    },
    post: props
  }) : null);
}

function Posts(props) {
  const [posts, setPosts] = useRecoilState(storedPosts);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    for (const post of props.posts) {
      // if (wishlist.length > 0) {
      //   for (const webinar of webinarUploads.data.list) {
      //     console.log(webinar);
      //     if (wishlist.some((e) => e._id === webinar.post._id)) {
      //       webinar.wishlisted = true;
      //     } else webinar.wishlisted = false;
      //   }
      // }
      setPosts(oldPosts => [...oldPosts, post]);
    }
  }, [props]);
  useEffect(async () => {
    if (posts.length == 0) {
      setLoading(true);
      const list = await renderWebinars();
      setLoading(false);
      setPosts(list.data.list);
    }
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, loading ? _Loader$5 || (_Loader$5 = /*#__PURE__*/React.createElement(Loader, null)) : null, posts.map(post => {
    return /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement(Post$4, {
      key: post.upload,
      post_id: post._id,
      file_id: post.upload,
      user_id: post.user,
      video_id: post.video_id,
      title: post.title,
      name: post.name,
      description: post.description,
      category: post.category,
      likes: post.likes.length,
      date: post.dateAdded,
      amount: post.amount,
      wishlisted: post.wishlisted
    }));
  }));
}

var _Loader$4, _h$6;

function Post$3(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "post"
  }, /*#__PURE__*/React.createElement("iframe", {
    className: "postThumbnail",
    src: props.url,
    frameborder: "0",
    webkitallowfullscreen: true,
    mozallowfullscreen: true,
    allowfullscreen: true
  }), /*#__PURE__*/React.createElement("h3", {
    className: "postTitle"
  }, props.title)));
}

function Purchases() {
  const [webinars, setPosts] = useRecoilState(storedPurchases);
  const [loading, setLoading] = useState(false);
  useEffect(async () => {
    if (webinars.length == 0) {
      setLoading(true);
      const list = await renderPurchases();
      setPosts(list.data.posts);
      setLoading(false);
    }
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, webinars.map(post => {
    return /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement(Post$3, {
      title: post.title,
      url: post.url
    }));
  }), loading ? _Loader$4 || (_Loader$4 = /*#__PURE__*/React.createElement(Loader, null)) : null, webinars.length == 0 && !loading && (_h$6 || (_h$6 = /*#__PURE__*/React.createElement("h2", null, "Your purchases will appear here..."))));
}

var _Loader$3, _h$5;

function Post$2(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "post"
  }, /*#__PURE__*/React.createElement("iframe", {
    className: "postThumbnail",
    src: props.url,
    frameborder: "0",
    webkitallowfullscreen: true,
    mozallowfullscreen: true,
    allowfullscreen: true
  }), /*#__PURE__*/React.createElement("h3", {
    className: "postTitle"
  }, props.title)));
}

function Uploads$1() {
  const [webinars, setPosts] = useRecoilState(storedUploads);
  const [loading, setLoading] = useState(false);
  useEffect(async () => {
    if (webinars.length == 0) {
      setLoading(true);
      const list = await renderUploads();
      setPosts(list.data.post);
      setLoading(false);
    }
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, webinars.map(post => {
    return /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement(Post$2, {
      title: post.title,
      url: `https://player.vimeo.com/video/${post.video_id}`
    }));
  }), loading ? _Loader$3 || (_Loader$3 = /*#__PURE__*/React.createElement(Loader, null)) : null, webinars.length == 0 && !loading && (_h$5 || (_h$5 = /*#__PURE__*/React.createElement("h2", null, "Your uploads will appear here..."))));
}

var _h$4;

function Collections() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, _h$4 || (_h$4 = /*#__PURE__*/React.createElement("h2", null, "Collections coming soon...")));
}

var _h$3;

function Courses() {
  return _h$3 || (_h$3 = /*#__PURE__*/React.createElement("h2", null, "Courses coming soon..."));
}

const searchValue = atom({
  key: 'searchValue',
  default: ""
});

document.querySelector("#register");
document.querySelector("#upload_btn");
document.querySelector("#login");
const createUserProfile = document.querySelector("#create_profile");
document.querySelector("#handle");
document.querySelector("#logout");
document.querySelector("#logoutAll");
document.querySelector("#deleteAccount");
const errorFlash = document.querySelector("#error_log");
const followBtn = document.querySelector("#follow_btn");
const searchBtn = document.querySelector("#search_btn");
const searchDisplay = document.querySelector("#searchedUser");
document.querySelector("#commentsContainer");
document.querySelectorAll(".authNav");
document.querySelectorAll(".unAuthNav"); //saving arrays to session storage

Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key));
}; // Variables


let token;
let flashMessage = "";
let flashBool = false;
const flashTime = 3000;
const pTag = document.createElement("p");
const pTag2 = document.createElement("p");
const imgTag = document.createElement("img");
const linkDom = document.createElement("a");
const divDom = document.createElement("div");
const authToken$1 = localStorage.getItem("userSession");
sessionStorage.getItem("userSession");
const instance = axios.create({
  baseURL: "https://piwebinarsdev.herokuapp.com",
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${authToken$1}`
  },
  withCredentials: true,
  credentials: "same-origin"
}); // Dark mode

if (localStorage.dark == "true") {
  document.getElementById("dark").setAttribute("href", "/css/dark.css");
}


async function login(username, password) {
  let uid = localStorage.uid;

  try {
    if ((username || password) === "") {
      alert("Please enter both fields");
    } else {
      const user = {
        username,
        password,
        uid
      };
      const response = await instance.post(`/login`, user);

      if (response.status === 200) {
        console.log(response);
        alert("User successfully logged in !!!");
        token = response.data.token;
        instance.defaults.headers.common["Authorization"] = token;
        sessionStorage.removeItem("userSession");
        localStorage.removeItem("userSession");
        sessionStorage.setItem("userSession", token);
        localStorage.setItem("userSession", token);
        sessionStorage.setItem("username", username);
        localStorage.setItem("username", username);
        return username;
      }
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    if (errorMessage.length > 0) alert(errorMessage);
  }
} // Register a new user


async function register(username, fullName, password, confirmPassword, referral) {
  try {
    if ((fullName || username || password || confirmPassword) === "") {
      alert("Please enter all required fields");
    } else if (confirmPassword !== password) {
      alert("Passwords do not match");
    } else if (password.length < 8) {
      alert("Passwords must be greater or equal to 8 characters");
    } else {
      const newUser = {
        name: fullName,
        username,
        password,
        referral
      };
      const response = await instance.post(`/register`, newUser);

      if (response.status === 201) {
        alert(`Welcome to Pi Webinars ${fullName}. Now please login.`);
      }
    }
  } catch (error) {
    const errorMessage = error.response.data.message;
    if (errorMessage.length > 0) flashMessage = errorMessage;
  }
} // Get profile 


async function myProfile() {
  const authTkn = localStorage.userSession;
  const response = await instance.get('/profile', {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTkn}`
    }
  });
  console.log(response);
  return response.data.profile;
} // Get user 


async function getProfile(user_id) {
  const response = await instance.get(`/profile/user/${user_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken$1}`
    }
  });
  console.log(response);
  return response.data.profile;
} // Edit handle


async function upload(fileType, title, description, price, category) {
  const formSection = document.getElementById("form");
  const errorFlash = document.querySelector("#upload_log");
  const video = document.querySelector("#videoUpload");
  document.querySelector("#thumbnailUpload");
  let certify_btn = document.querySelector("#certify");

  if (certify_btn.checked == true) {
    document.getElementById("submitBtn").style.display = "none";
    const authToken = localStorage.getItem("userSession");
    const formData = new FormData(formSection);
    console.log(formData);
    formData.append("category", category);
    if ((title || description) === "" || video === null) return "Unable to process.";else {
      try {
        let message = `Preparing your upload . . .`;
        pTag.textContent = message;
        errorFlash.appendChild(pTag);
        flashBool = true;
        const config = {
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
            let message = `Uploading your webinar . . . ${percentCompleted}%`;
            if (percentCompleted === 100) message = "Please wait, verifying your upload . . .";
            pTag.textContent = message;
            errorFlash.appendChild(pTag);
            flashBool = true;
          }
        };
        const response = await instance.post(`/upload/file_upload`, formData, config, {
          headers: {
            "Content-Type": "multipart/form-data; boundary='--sampleBoundary'",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${authToken}`
          },
          withCredentials: true,
          credentials: "same-origin"
        });

        if (response.status === 200) {
          const message = "Successfully uploaded your webinar !!!";
          flashMessage = message;
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        if (errorMessage.length > 0) flashMessage = errorMessage;
      }

      flashBool = true; // Flash message

      if (flashBool && flashMessage.length > 0) {
        pTag.textContent = flashMessage;
        errorFlash.appendChild(pTag);
        setTimeout(() => {
          flashMessage = "";
          flashBool = false;
          errorFlash.removeChild(pTag);
        }, 120000);
      }
    }
  }
} // Log user out current session


if (searchBtn !== null) {
  searchBtn.addEventListener("click", async e => {
    e.preventDefault();
    const searchName = document.querySelector("#search_user").value.trim();

    try {
      if (searchName === "") {
        const message = "Cannot search empty fields!!!";
        flashMessage = message;
      } else {
        const response = await instance.get(`/profile/handle/${searchName}`, {
          params: {
            handle: searchName
          }
        });

        if (response.status === 200) {
          // localStorage.setItem("userProfileName", searchName);
          const {
            handle,
            user: {
              name: user_name,
              _id: userId
            }
          } = response.data.profile;
          localStorage.setItem("user_id", userId);
          pTag.setAttribute("class", "searched_user_name");
          pTag2.setAttribute("class", "searched_user_handle");
          pTag.textContent = user_name;
          pTag2.textContent = `@${handle}`;
          imgTag.src = "../../img/avatar.png";
          imgTag.setAttribute("class", "searched_user_avatar");
          linkDom.setAttribute("href", `/html/userProfile.html`);
          linkDom.setAttribute("class", `searchedUserLink`);
          divDom.setAttribute("class", "name_section");
          divDom.appendChild(pTag);
          divDom.appendChild(pTag2);
          linkDom.appendChild(imgTag);
          linkDom.appendChild(divDom);
          searchDisplay.appendChild(linkDom);
        }
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      if (errorMessage && errorMessage.length > 0) flashMessage = errorMessage;
    }

    flashBool = true; // Flash message

    if (flashBool && flashMessage.length > 0) {
      pTag.textContent = flashMessage;
      errorFlash.appendChild(pTag);
      setTimeout(() => {
        flashMessage = "";
        flashBool = false;
        errorFlash.removeChild(pTag);
      }, flashTime);
    }
  });
} // Create profile from profile


if (createUserProfile !== null) {
  document.querySelector(".stats").style.display = "none";
} // Follow or Unfollow a user


if (followBtn !== null) {
  followBtn.addEventListener("click", async e => {
    e.preventDefault();
    let user_id = localStorage.user_id;

    try {
      const response = await instance.post(`/profile/auth_follow_unfollow/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${authToken$1}`
        },
        withCredentials: true,
        credentials: "same-origin"
      });

      if (response.status === 200) {
        const profile = await instance.get(`/profile`);
        if (profile.status === 200) localStorage.setObj("following", profile.data.profile.following);
        window.location.reload();
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      return errorMessage;
    }
  });
}

const likeComments = document.querySelectorAll(".likeComment");
const editComments = document.querySelectorAll(".editComment");
const replyComments = document.querySelectorAll(".replyComment");
const deleteComments = document.querySelectorAll(".deleteComment");

const manipulateComment = (comment, url_path, api) => {
  return comment.addEventListener("click", async e => {
    const user_id = localStorage.getItem("user_id");
    const post_id = localStorage.getItem("post_id");
    const comment_id = e.target.dataset.comment_id;

    try {
      const response = await instance[api](`/post/${url_path}/${user_id}/${post_id}/${comment_id}`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${authToken$1}`
        },
        withCredentials: true,
        credentials: "same-origin"
      });

      if (response.status === 200) {
        window.location.reload();
        return "Success";
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      return errorMessage;
    }
  });
};

const manipulateEdits = (comment, api) => {
  const editCommentModal = document.querySelector("#editCommentModal");
  const editCommentInputLabel = document.querySelector("#editCommentInputLabel");
  return comment.addEventListener("click", async e => {
    editCommentModal.style.display = "flex";
    const user_id = localStorage.getItem("user_id");
    const post_id = localStorage.getItem("post_id");
    const comment_id = e.target.dataset.comment_id;
    const editCommentBtn = document.querySelector("#editCommentBtn");
    const editModalCloseBtn = document.querySelector("#editModalClose");

    if (api === "post") {
      editCommentInputLabel.textContent = "Reply on Comment";
      editCommentBtn.textContent = "Reply";
    }

    if (editModalCloseBtn !== null) {
      editModalCloseBtn.addEventListener("click", () => {
        editCommentModal.style.display = "none";
      });
    }

    if (editCommentBtn !== null) {
      editCommentBtn.addEventListener("click", async e => {
        e.preventDefault();
        const editCommentInput = document.querySelector("#editCommentInput").value;
        if (editCommentInput.length <= 0) return;else {
          try {
            const data = {
              text: editCommentInput
            };
            const response = await instance[api](`/post/comment/${user_id}/${post_id}/${comment_id}`, data);

            if (response.status === 200) {
              // Edit comment
              editCommentModal.style.display = "none";
              window.location.reload();
              return "Success";
            }
          } catch (error) {
            const errorMessage = error.response.data.message;
            if (errorMessage && errorMessage.length > 0) return error.response;
          }
        }
      });
    }
  });
}; // Like or Unlike a comment


if (likeComments !== null) {
  const url_path = "like_unlike_comment";
  const api = "post";
  likeComments.forEach(comment => manipulateComment(comment, url_path, api));
} // Delete a comment


if (deleteComments !== null) {
  const url_path = "comment";
  const api = "delete";
  deleteComments.forEach(comment => manipulateComment(comment, url_path, api));
} // Edit a comment


if (editComments !== null) {
  const api = "put";
  editComments.forEach(comment => manipulateEdits(comment, api));
} // Reply on a comment


if (replyComments !== null) {
  const api = "post";
  replyComments.forEach(comment => manipulateEdits(comment, api));
}

var _Loader$2, _br$1, _br2$1, _br3$1, _br4$1, _Search;

function SearchResults(props) {
  useEffect(() => {
    function close(e) {
      if (!document.querySelector("#results").contains(e.target)) {
        props.close();
      }
    }

    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    };
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "results"
  }, props.loading ? _Loader$2 || (_Loader$2 = /*#__PURE__*/React.createElement(Loader, null)) : null, props.posts.map(post => {
    return /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement(Posts, {
      key: post.upload,
      post_id: post._id,
      file_id: post.upload,
      user_id: post.user,
      video_id: post.video_id,
      title: post.title,
      name: post.name,
      description: post.description,
      category: post.category,
      likes: post.likes.length,
      date: post.dateAdded,
      amount: post.amount,
      wishlisted: post.wishlisted
    }));
  })));
}

function Search() {
  const [input, setInput] = useRecoilState(searchValue);
  const [results, setResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setInput(e.target.value);
    filter(input);
  };

  const handleSearch = async () => {// setSearchActive(true);
    // setLoading(true);
    // const posts = await search(input);
    // setResults(posts);
    // setLoading(false);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    id: "searchBar"
  }, /*#__PURE__*/React.createElement("input", {
    id: "searchInput",
    placeholder: "Search topics...",
    onChange: e => handleChange(e)
  }), /*#__PURE__*/React.createElement("a", {
    className: "fas fa-search",
    onClick: handleSearch
  })), searchActive ? /*#__PURE__*/React.createElement(SearchResults, {
    posts: results,
    loading: loading,
    close: () => {
      setSearchActive(false);
    }
  }) : null);
}

function AuthPopup(props) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const authenticate = async () => {
    if (props.type == 'login') {
      await login(username, password);
      props.toggle();
    } else {
      await register(username, name, password, confirmPassword);
      props.toggle();
    }
  };

  useEffect(() => {
    function close(e) {
      if (!document.querySelector(".popup").contains(e.target)) {
        props.close();
      }
    }

    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "popup"
  }, /*#__PURE__*/React.createElement("h2", null, props.header), /*#__PURE__*/React.createElement("a", {
    onClick: props.close
  }, "x"), /*#__PURE__*/React.createElement("input", {
    id: "usernameInput",
    placeholder: "Enter username",
    onChange: e => setUsername(e.target.value)
  }), _br$1 || (_br$1 = /*#__PURE__*/React.createElement("br", null)), props.type == "register" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    id: "nameInput",
    placeholder: "Add your name",
    onChange: e => setName(e.target.value)
  }), _br2$1 || (_br2$1 = /*#__PURE__*/React.createElement("br", null))), /*#__PURE__*/React.createElement("input", {
    id: "passwordInput",
    placeholder: "Enter password",
    onChange: e => setPassword(e.target.value)
  }), _br3$1 || (_br3$1 = /*#__PURE__*/React.createElement("br", null)), props.type == "register" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    id: "confirmPassword",
    placeholder: "Confirm password",
    onChange: e => setConfirmPassword(e.target.value)
  }), _br4$1 || (_br4$1 = /*#__PURE__*/React.createElement("br", null))), /*#__PURE__*/React.createElement("p", {
    onClick: authenticate
  }, "submit"));
}

function User$1(props) {
  const [modalShown, toggleModal] = useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    id: props.type,
    onClick: () => {
      toggleModal(!modalShown);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: props.class
  }), /*#__PURE__*/React.createElement("a", {
    className: "userLogin"
  }, props.label)), modalShown ? /*#__PURE__*/React.createElement(AuthPopup, {
    header: props.label,
    type: props.type,
    toggle: () => {
      props.toggle();
    },
    close: () => {
      toggleModal(!modalShown);
    }
  }) : null);
}

function Bar() {
  const [authed, setAuth] = useState(false);
  useEffect(() => {
    if (localStorage.userSession) setAuth(true);else setAuth(false);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    id: "bar"
  }, _Search || (_Search = /*#__PURE__*/React.createElement(Search, null)), authed === true ? /*#__PURE__*/React.createElement("p2", {
    id: "welcomeMessage"
  }, "Welcome, ", localStorage.username) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(User$1, {
    toggle: () => {
      setAuth(true);
    },
    type: "register",
    class: "fas fa-user-plus userLoginIcon",
    label: "Register"
  }), /*#__PURE__*/React.createElement(User$1, {
    toggle: () => {
      setAuth(true);
    },
    type: "login",
    class: "fas fa-user userLoginIcon",
    label: "Login"
  }))));
}

var _Purchases, _Uploads$1, _Courses, _Collections, _Bar, _Selection;

function Content(props) {
  const selectionState = useRecoilValue(appSelectionState);
  const posts = props.posts;
  return /*#__PURE__*/React.createElement(RecoilRoot, null, selectionState == 'explore' && /*#__PURE__*/React.createElement(Posts, {
    posts: posts
  }), selectionState == 'purchases' && (_Purchases || (_Purchases = /*#__PURE__*/React.createElement(Purchases, null))), selectionState == 'uploads' && (_Uploads$1 || (_Uploads$1 = /*#__PURE__*/React.createElement(Uploads$1, null))), selectionState == 'courses' && (_Courses || (_Courses = /*#__PURE__*/React.createElement(Courses, null))), selectionState == 'collections' && (_Collections || (_Collections = /*#__PURE__*/React.createElement(Collections, null))));
}

function App$1() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScroll = async e => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom) {
      setLoading(true);
      const response = await renderMore();
      const morePosts = response.data.list;
      let list = [];

      for (const post of morePosts) {
        list.push(post);
      }

      setPosts(list);
      setLoading(false);
    }
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, _Bar || (_Bar = /*#__PURE__*/React.createElement(Bar, null)), /*#__PURE__*/React.createElement("span", {
    id: "app",
    onScroll: handleScroll,
    style: {
      cursor: loading && "wait"
    }
  }, _Selection || (_Selection = /*#__PURE__*/React.createElement(Selection, null)), /*#__PURE__*/React.createElement(Content, {
    posts: posts
  })));
}

var _div, _input, _option, _option2, _br, _input2, _br2, _br3, _br4, _br5, _option3, _br6, _option4, _br7, _option5, _br8, _option6, _br9, _option7, _br10, _option8, _br11, _option9, _br12, _option10, _br13, _option11, _br14, _option12, _br15, _option13, _br16, _option14, _br17, _br18, _label, _br19, _br20, _p, _p2, _span$1;

function PricesPopup(props) {
  useEffect(() => {
    function close(e) {
      if (!document.querySelector(".popup").contains(e.target)) {
        props.close();
      }
    }

    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    };
  }, []);
  return _div || (_div = /*#__PURE__*/React.createElement("div", {
    className: "popup"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Webinar Length"), /*#__PURE__*/React.createElement("th", null, "Recommended Price")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "5-10mins"), /*#__PURE__*/React.createElement("th", null, "0.2 Pi")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "10-20mins"), /*#__PURE__*/React.createElement("th", null, "0.5 Pi")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "20-40mins"), /*#__PURE__*/React.createElement("th", null, "0.8 Pi")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "40-60mins"), /*#__PURE__*/React.createElement("th", null, "1 Pi")))));
}

function UploadForm() {
  const [modalShown, toggleModal] = React.useState(false);
  const [fileType, setFileType] = useState("MP4");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("None");
  const [certified, setCertify] = useState(false);

  const handleFileTypeChange = event => {
    setFileType(event.target.value);
  };

  const handleCategoryChange = event => {
    setCategory(event.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(fileType, title, description, price, category);
    document.getElementById("certify").checked;
    const response = await upload(fileType, title, description, price, category);
    console.log(response);
  };

  const handleCertified = async () => {
    setCertify(!certified);
    const btn = document.getElementById("submitBtn");
    btn.disabled = !btn.disabled;
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    action: "/upload",
    method: "POST",
    id: "form"
  }, /*#__PURE__*/React.createElement("label", null, "Video :", _input || (_input = /*#__PURE__*/React.createElement("input", {
    name: "videoUpload",
    type: "file",
    id: "videoUpload"
  })), /*#__PURE__*/React.createElement("select", {
    style: {
      display: 'none'
    },
    id: "fileType",
    value: fileType,
    onChange: handleFileTypeChange
  }, _option || (_option = /*#__PURE__*/React.createElement("option", {
    value: "MP4"
  }, "MP4")), _option2 || (_option2 = /*#__PURE__*/React.createElement("option", {
    value: "MOV"
  }, "MOV")))), _br || (_br = /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'none'
    }
  }, "Thumbnail:", _input2 || (_input2 = /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "thumbnailUpload",
    id: "videoThumbnail"
  }))), _br2 || (_br2 = /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("input", {
    class: "in",
    name: "title",
    placeholder: "Title",
    type: "text",
    onChange: e => setTitle(e.target.value),
    required: true
  }), _br3 || (_br3 = /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("textArea", {
    class: "in",
    name: "description",
    placeholder: "Description",
    type: "text",
    onChange: e => setDescription(e.target.value)
  }), _br4 || (_br4 = /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("input", {
    class: "in",
    name: "amount",
    placeholder: "Set a price",
    type: "number",
    onChange: e => setPrice(e.target.value)
  }), /*#__PURE__*/React.createElement("i", {
    onClick: () => {
      toggleModal(!modalShown);
    }
  }, "See Price Guide"), _br5 || (_br5 = /*#__PURE__*/React.createElement("br", null)), modalShown ? /*#__PURE__*/React.createElement(PricesPopup, {
    close: () => {
      toggleModal(!modalShown);
    }
  }) : null, /*#__PURE__*/React.createElement("label", null, "Select category:", /*#__PURE__*/React.createElement("select", {
    value: category,
    onChange: handleCategoryChange
  }, _option3 || (_option3 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "none"
  }, "None")), _br6 || (_br6 = /*#__PURE__*/React.createElement("br", null)), _option4 || (_option4 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "cryptocurrency"
  }, "Cryptocurrency")), _br7 || (_br7 = /*#__PURE__*/React.createElement("br", null)), _option5 || (_option5 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "education"
  }, "Education")), _br8 || (_br8 = /*#__PURE__*/React.createElement("br", null)), _option6 || (_option6 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "fitness"
  }, "Fitness")), _br9 || (_br9 = /*#__PURE__*/React.createElement("br", null)), _option7 || (_option7 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "food"
  }, "Food")), _br10 || (_br10 = /*#__PURE__*/React.createElement("br", null)), _option8 || (_option8 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "history"
  }, "History")), _br11 || (_br11 = /*#__PURE__*/React.createElement("br", null)), _option9 || (_option9 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "money"
  }, "Money")), _br12 || (_br12 = /*#__PURE__*/React.createElement("br", null)), _option10 || (_option10 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "nature"
  }, "Nature")), _br13 || (_br13 = /*#__PURE__*/React.createElement("br", null)), _option11 || (_option11 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "pi-network"
  }, "Pi Network")), _br14 || (_br14 = /*#__PURE__*/React.createElement("br", null)), _option12 || (_option12 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "politics"
  }, "Politics")), _br15 || (_br15 = /*#__PURE__*/React.createElement("br", null)), _option13 || (_option13 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "sports"
  }, "Sports")), _br16 || (_br16 = /*#__PURE__*/React.createElement("br", null)), _option14 || (_option14 = /*#__PURE__*/React.createElement("option", {
    name: "category",
    value: "technology"
  }, "Technology")), _br17 || (_br17 = /*#__PURE__*/React.createElement("br", null)))), _br18 || (_br18 = /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    onChange: handleCertified,
    id: "certify",
    required: true
  }), _label || (_label = /*#__PURE__*/React.createElement("label", {
    for: "certify"
  }, " I certify that I own this content")), _br19 || (_br19 = /*#__PURE__*/React.createElement("br", null))), _br20 || (_br20 = /*#__PURE__*/React.createElement("br", null)), sessionStorage.userSession ? /*#__PURE__*/React.createElement("input", {
    type: "button",
    id: "submitBtn",
    value: "Upload",
    onClick: e => handleSubmit(e),
    disabled: true
  }) : _p || (_p = /*#__PURE__*/React.createElement("p", null, "Please login to upload!")), _p2 || (_p2 = /*#__PURE__*/React.createElement("p", {
    id: "upload_log"
  }))));
}

class Upload extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, _span$1 || (_span$1 = /*#__PURE__*/React.createElement("span", {
      id: "uploadPage"
    }, /*#__PURE__*/React.createElement(UploadForm, null))));
  }

}

async function auth() {
  const scopes = ["username", "payments"];

  function onIncompletePaymentFound(payment) {
    var data = {
      paymentId: payment.identifier,
      txid: payment.transaction.txid
    };
    axios.post("https://piwebinars-server.onrender.com/payment/incomplete", data);
  }

  Pi.authenticate(scopes, onIncompletePaymentFound).then(async function (auth) {
    const userName = auth.user.username;
    const uid = auth.user.uid;
    localStorage.uid = uid;
    localStorage.piName = userName;
    localStorage.piAccessToken = auth.accessToken;

    if (!sessionStorage.userSession) {
      piLogin();
    }
  });
}

async function piLogin() {
  try {
    const config = {
      name: localStorage.piName,
      username: localStorage.piName,
      uid: localStorage.uid,
      piAccessToken: localStorage.piAccessToken
    };
    const response = await axios.post(`https://piwebinars-server.onrender.com/login/pi`, config);

    if (response.status === 200 || response.status === 201) {
      const token = response.data.token;
      sessionStorage.removeItem("userSession");
      localStorage.removeItem("userSession");
      sessionStorage.setItem("userSession", token);
      localStorage.setItem("userSession", token);
      sessionStorage.setItem("username", localStorage.piName); // show logged in

      authNavv.forEach(elem => {
        elem.classList.remove("authNav");
        elem.classList.add("showNav");
      });
      unAuthNavv.forEach(elem => {
        elem.style.display = "none";
      });
    }

    if (response.status === 201) {
      alert("Welcome to Pi Webinars!");
    }
  } catch (error) {
    return error;
  }
}

auth();

function buyWebinar(userId, post_id, video_id, price, title) {
  if (navigator.userAgent.toLowerCase().indexOf("pibrowser") < 0) {
    alert("Please go to the Pi Browser to make a crypto payment");
    window.open("pi://www.piwebinars.co.uk");
  }

  if (sessToken === null || authToken === null) {
    alert("Please login to purchase a webinar!");
    return null;
  }

  const username = sessionStorage.username;
  const url = "https://player.vimeo.com/video/" + video_id;
  Pi.createPayment({
    amount: price,
    memo: "Buy Webinar",
    metadata: {
      paymentType: "webinar_purchase"
    }
  }, {
    onReadyForServerApproval: function (paymentId) {
      var data = {
        paymentId: paymentId,
        txid: ""
      };
      axios.post("https://piwebinars-server.onrender.com/payment/approve", data);
    },
    onReadyForServerCompletion: async function (paymentId, txid) {
      var data = {
        paymentId: paymentId,
        txid: txid,
        username: username,
        userId: userId,
        post_id: post_id,
        url: url,
        title: title,
        price: price
      };
      const authToken = localStorage.getItem("userSession");
      const response = await axios.post("https://piwebinars-server.onrender.com/payment/complete", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        withCredentials: true,
        credentials: "same-origin"
      });
      return response;
    },
    onCancel: function (paymentId, txid) {
      var data = {
        paymentId: paymentId,
        txid: txid
      };
      axios.post("https://piwebinars-server.onrender.com/payment/incomplete", data);
    },
    onError: function (paymentId, txid) {
      var data = {
        paymentId: paymentId,
        txid: txid
      };
      axios.post("https://piwebinars-server.onrender.com/payment/incomplete", data);
    }
  });
}

var _Loader$1, _h$2, _RenderedList, _h2;
//   key: 'getCurrentWishlist',
//   get: ({get}) => {
//     return get(storedWishlist);
//   },
// });

function Post$1(props) {
  const [modalShown, toggleModal] = useState(false);
  const [webinars, setPosts] = useRecoilState(storedWishlist);

  const open = () => {
    toggleModal(!modalShown);
  };

  const purchase = async () => {
    await buyWebinar();
  };

  const remove = async () => {
    let list = [];

    for (const post of webinars) {
      if (post.title != props.title) list.push(post);
    }

    setPosts(list);
    await addWishlist$1(props);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "post"
  }, /*#__PURE__*/React.createElement("img", {
    onClick: open,
    className: "postThumbnail",
    src: `https://vumbnail.com/${props.video_id}.jpg`
  }), /*#__PURE__*/React.createElement("h3", {
    className: "postTitle"
  }, props.title), /*#__PURE__*/React.createElement("div", {
    className: "statDiv"
  }, /*#__PURE__*/React.createElement("p2", {
    className: "statName"
  }, props.name), /*#__PURE__*/React.createElement("p2", {
    className: "statCategory"
  }, props.category), /*#__PURE__*/React.createElement("p2", {
    className: "statLikes"
  }, "Watch for ", /*#__PURE__*/React.createElement("b", null, props.amount, " Pi"))), /*#__PURE__*/React.createElement("div", {
    className: "wishlistOptions"
  }, /*#__PURE__*/React.createElement("i", {
    onClick: purchase,
    className: "fas fa-cart-plus"
  }), /*#__PURE__*/React.createElement("i", {
    onClick: remove,
    className: "fas fa-minus"
  }))), modalShown ? /*#__PURE__*/React.createElement(Cinema, {
    close: () => {
      toggleModal(!modalShown);
    },
    post: props
  }) : null);
}

function RenderedList() {
  const [webinars, setPosts] = useRecoilState(storedWishlist);
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    if (webinars.length == 0) {
      const list = await renderWishlist();
      setPosts(list.data.wishlist);
      setLoading(false);
    } else setLoading(false);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    id: "page"
  }, loading ? _Loader$1 || (_Loader$1 = /*#__PURE__*/React.createElement(Loader, null)) : null, webinars.map(post => {
    return /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement(Post$1, {
      key: post.upload,
      post_id: post._id,
      file_id: post.upload,
      user_id: post.user,
      video_id: post.video_id,
      title: post.title,
      name: post.name,
      description: post.description,
      category: post.category,
      date: post.dateAdded,
      amount: post.amount,
      post: post
    }));
  }), webinars.length == 0 && localStorage.userSession && !loading && (_h$2 || (_h$2 = /*#__PURE__*/React.createElement("h2", null, "Webinars in your wishlist will appear here...")))));
}

function Wishlist() {
  return /*#__PURE__*/React.createElement(RecoilRoot, null, _RenderedList || (_RenderedList = /*#__PURE__*/React.createElement(RenderedList, null)), !localStorage.userSession && (_h2 || (_h2 = /*#__PURE__*/React.createElement("h2", null, "Please login to see your wishlist of webinars"))));
}

var _img$1, _img2$1, _i, _Uploads;
function Profile$1() {
  const [profile, setProfile] = useState({
    name: "loading..",
    username: "loading..",
    avatar: '',
    followers: 0,
    following: 0,
    credit: 0,
    verified: false
  });
  useEffect(async () => {
    const data = await myProfile();
    setProfile({
      name: data.user.name,
      username: data.handle,
      avatar: data.avatar,
      followers: data.people_Who_Follow_Me,
      following: data.people_Who_I_Follow,
      credit: data.credit,
      verified: data.verified
    });
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    id: "page"
  }, /*#__PURE__*/React.createElement("div", {
    id: "profile"
  }, profile.avatar ? /*#__PURE__*/React.createElement("img", {
    id: "avatar",
    src: profile.avatar
  }) : _img$1 || (_img$1 = /*#__PURE__*/React.createElement("img", {
    id: "avatar",
    src: "https://piwebinars.co.uk/img/avatar.png"
  })), /*#__PURE__*/React.createElement("h2", null, profile.name), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("p2", null, "@", profile.username), profile.verified === true ? _img2$1 || (_img2$1 = /*#__PURE__*/React.createElement("img", {
    id: "verified",
    src: "https://www.piwebinars.co.uk/img/Verified_Icon.png"
  })) : null), /*#__PURE__*/React.createElement("p", null, "Followers: ", profile.followers), /*#__PURE__*/React.createElement("p", null, "Following: ", profile.following), /*#__PURE__*/React.createElement("p", null, "Credit: ", profile.credit, " ", _i || (_i = /*#__PURE__*/React.createElement("i", null, "Pi")))), _Uploads || (_Uploads = /*#__PURE__*/React.createElement(Uploads$1, null))));
}

var _Loader, _h$1, _img, _img2;

function Post(props) {
  const [modalShown, toggleModal] = useState(false);
  const [isWishlist, setWishlist] = useState(false);
  useEffect(() => {
    if (props.wishlisted == true) {
      setWishlist(true);
    }
  }, []);

  const open = () => {
    toggleModal(!modalShown);
  };

  const add = async () => {
    setWishlist(!isWishlist);
    await addWishlist(props);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "post"
  }, /*#__PURE__*/React.createElement("img", {
    onClick: open,
    className: "postThumbnail",
    src: `https://vumbnail.com/${props.video_id}.jpg`
  }), /*#__PURE__*/React.createElement("h3", {
    className: "postTitle"
  }, props.title), /*#__PURE__*/React.createElement("div", {
    className: "statDiv"
  }, /*#__PURE__*/React.createElement("p2", {
    className: "statCategory"
  }, props.category), /*#__PURE__*/React.createElement("p2", {
    className: "statLikes"
  }, props.likes, " likes")), isWishlist == false ? /*#__PURE__*/React.createElement("i", {
    onClick: add,
    className: "fas fa-plus addWishlist"
  }) : /*#__PURE__*/React.createElement("i", {
    onClick: add,
    className: "fas fa-minus addWishlist"
  })), modalShown ? /*#__PURE__*/React.createElement(Cinema, {
    close: () => {
      toggleModal(!modalShown);
    },
    post: props
  }) : null);
}

function Uploads(props) {
  const [webinars, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(async () => {
    if (webinars.length == 0) {
      setLoading(true);
      const list = await renderCreator(props.userId);
      setPosts(list.data.posts);
      setLoading(false);
    }
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, webinars.map(post => {
    return /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement(Post, {
      key: post.upload,
      post_id: post._id,
      file_id: post.upload,
      user_id: post.user,
      video_id: post.video_id,
      title: post.title,
      name: post.name,
      description: post.description,
      category: post.category,
      likes: post.likes.length,
      date: post.dateAdded,
      amount: post.amount,
      wishlisted: post.wishlisted
    }));
  }), loading ? _Loader || (_Loader = /*#__PURE__*/React.createElement(Loader, null)) : null, webinars.length == 0 && !loading && (_h$1 || (_h$1 = /*#__PURE__*/React.createElement("h2", null, "Loading webinars..."))));
}

function User(props) {
  const [profile, setProfile] = useState({
    name: "loading..",
    username: "loading..",
    avatar: '',
    followers: 0,
    following: 0,
    verified: false
  });
  useEffect(async () => {
    const userId = props.userId;
    const data = await getProfile(userId);
    setProfile({
      name: data.user.name,
      username: data.handle,
      avatar: data.avatar,
      followers: data.people_Who_Follow_Me,
      following: data.people_Who_I_Follow,
      verified: data.verified
    });
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    id: "page"
  }, /*#__PURE__*/React.createElement("div", {
    id: "profile"
  }, profile.avatar ? /*#__PURE__*/React.createElement("img", {
    id: "avatar",
    src: profile.avatar
  }) : _img || (_img = /*#__PURE__*/React.createElement("img", {
    id: "avatar",
    src: "https://piwebinars.co.uk/img/avatar.png"
  })), /*#__PURE__*/React.createElement("h2", null, profile.name), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("p2", null, "@", profile.username), profile.verified === true ? _img2 || (_img2 = /*#__PURE__*/React.createElement("img", {
    id: "verified",
    src: "https://www.piwebinars.co.uk/img/Verified_Icon.png"
  })) : null), /*#__PURE__*/React.createElement("p", null, "Followers: ", profile.followers), /*#__PURE__*/React.createElement("p", null, "Following: ", profile.following)), /*#__PURE__*/React.createElement(Uploads, {
    userId: props.userId
  })));
}

var _span;
function Profile() {

  return /*#__PURE__*/React.createElement(React.Fragment, null, _span || (_span = /*#__PURE__*/React.createElement("span", {
    id: "page"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: login
  }, "Login"))));
}

var _h;

class NoPage extends React.Component {
  render() {
    return _h || (_h = /*#__PURE__*/React.createElement("h2", null, "404"));
  }

}

var _RecoilRoot;

function UserProfile() {
  let {
    user_id
  } = useParams();
  return /*#__PURE__*/React.createElement(User, {
    userId: user_id
  });
}

function App() {
  return _RecoilRoot || (_RecoilRoot = /*#__PURE__*/React.createElement(RecoilRoot, null, /*#__PURE__*/React.createElement(BrowserRouter, null, /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
    path: "/",
    element: /*#__PURE__*/React.createElement(Layout, null)
  }, /*#__PURE__*/React.createElement(Route, {
    index: true,
    element: /*#__PURE__*/React.createElement(App$1, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "upload",
    element: /*#__PURE__*/React.createElement(Upload, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "wishlist",
    element: /*#__PURE__*/React.createElement(Wishlist, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "profile",
    element: /*#__PURE__*/React.createElement(Profile$1, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "user/:user_id",
    element: /*#__PURE__*/React.createElement(UserProfile, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "login",
    element: /*#__PURE__*/React.createElement(Profile, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "*",
    element: /*#__PURE__*/React.createElement(NoPage, null)
  }))))));
}
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));

export { App as default };
