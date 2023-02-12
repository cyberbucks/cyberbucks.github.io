import React, {useEffect, useState, useRef} from 'react';
import {Wheel} from 'react-custom-roulette';
import { useDencrypt } from "use-dencrypt-effect";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




import {
    addJackpotEntry,
    authLogout,
    firebaseApp,
    getUserData,
    initiateRaffle,
    setUserAdblock,
    getJackpotData,
    getMockupAdData
} from "../firebaseUtilities";
import {
    Alert, AlertIcon,
    Box,
    Button,
    Center,
    CircularProgress,
    Container,
    Flex,
    IconButton,
    Image,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    useDisclosure,
    Heading,
    Icon,
    SlideFade,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react"
import {HamburgerIcon} from '@chakra-ui/icons'
import {Link as ReactLink, useHistory} from "react-router-dom";
import Jackpot from './Jackpot';

import RefillTimer from './RefillTimer';
import {useDetectAdBlock} from "adblock-detect-react";
import {
    AiOutlineClockCircle,
    BiDownArrow,
    GiAbstract102,
    BiSupport,
    FaUserAlt,
    FaUserPlus,
    FaUsers,
    FiExternalLink,
    GiCarWheel,
    ImSpinner9,
    ImTicket,
    MdCreditCard,
    RiLogoutBoxFill,
    RiSafeFill,
    SiJsonwebtokens,
    GiSpeaker,
    GiSpeakerOff,
    MdLocalOffer, WiMoonAltNew
} from "react-icons/all";
import {printText} from "../devUtilities";
import preval from "preval.macro";
import '../styles/solarFlare.css';
import {VFXImg, VFXProvider} from "react-vfx";
import {DateTime} from "luxon";
import Countdown from "react-countdown";
import useSound from 'use-sound';

import glitchSound from '../styles/sounds/glitchEffect.mp3';



const data = [
  { option: 'Empty', style: { textColor: '#A22F2F'}},
  { option: 'Cash' , style: { textColor: '#55A726'}},
  { option: 'Token' , style: { textColor: '#F8D62F'}},
  { option: 'Empty', style: { textColor: '#A22F2F'}},
  { option: 'Cash' , style: { textColor: '#55A726'}},
  { option: 'Empty', style: { textColor: '#A22F2F'}},
  { option: 'Ticket', style: { textColor: '#D22576'}},
  { option: 'Cash' , style: { textColor: '#55A726'}},
  { option: 'Empty', style: { textColor: '#A22F2F'}},
  { option: 'Token' , style: { textColor: '#F8D62F'}},
  { option: 'Glitch' , style: { textColor: '#9031A4'}},
];



const options = {
interval: 1
}

var localToastAds = []

const backgroundColors = ['#9E2E8A', '#E547C9'];
const textColors = ['#eeeeee'];
const outerBorderColor = 'black';
const outerBorderWidth = 5;
const innerBorderColor = '#eeeeee';
const innerBorderWidth = 0;
const innerRadius = 0;
const radiusLineColor = 'black';
const radiusLineWidth = 1;
const fontSize = 25;
const textDistance = 60;

let postSpinModalMessage = (
  <h1>Message Template</h1>
)

let postSpinGlitchedMessage = "Glitch Example"

let prizeIsEmpty = false


// Modal.setAppElement('#root')


export default function WheelComp({userData, userId}) {


    const [mustSpin, setMustSpin] = useState(false)
    const [prize, setPrize] = useState()
    const [postSpinModalIsOpen, setPostSpinModalIsOpen] = useState(false)
    const [addGoldModalIsOpen, setAddGoldModalIsOpen] = useState(false)
    const [prizeCash, setPrizeCash] = useState(0.0)
    const [myCash, setMyCash] = useState(0.0)
    const [myGold, setMyGold] = useState(0)
    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [jackpotData, setJackpotData] = useState({})

    const {isGoldModalOpen, onGoldModalOpen, onGoldModalClose} = useDisclosure()

    const adBlockDetected = useDetectAdBlock();
    let [animationTrigger, setAnimationTrigger] = useState(0)

    const [prizeNumberFromComp, setPrizeNumberFromComp] = useState({value: 0, type: 0})

    const sendPrizeNumberToParent = (prizeNum) => {
      setPrizeNumberFromComp(prizeNum)
    }
    const [initialFetchHappened, setInitialFetchHappened] = useState(false)
    const [myUserData, setMyUserData] = useState({})
    const [showAccountMessage, setShowAccountMessage] = useState(false)

    const [playGlitch] = useSound(glitchSound)

    const { result, dencrypt } = useDencrypt(options)

    const [topBannerSrc, setTopBannerSrc] = useState({})
    const [bottomBannersSrcs, setBottomBannersSrcs] = useState([{
      href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    },
    {
      href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    },
    {
      href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    },
    {
      href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    }])

    const [toastAd, setToastAd] = useState({
      text: "Do this and earn EASY $100!",
      href: "http://fumacrom.com/2962T"
    })

    const [speakerOn, setSpeakerOn] = useState(true)





    // This block is also present in Header.js
    // Don't forget to work on them both (or find a solution for duplicate code)
    const history = useHistory()
    const logoutClick = () => {
        authLogout().then(r => {
            history.push("/")
        })
    }


    useEffect(() => {

      handleGlitchChange("Reset")

      prizeIsEmpty = false

      if(prizeNumberFromComp.type == 0 || prizeNumberFromComp.type == 3 || prizeNumberFromComp.type == 5 || prizeNumberFromComp.type == 8) {

        postSpinGlitchedMessage = "Sorry, you couldn't earn anything."

        prizeIsEmpty = true
      } else if (prizeNumberFromComp.type == 1 || prizeNumberFromComp.type == 4 || prizeNumberFromComp.type == 7) {

        postSpinGlitchedMessage = "You earned $" + prizeNumberFromComp.value + "!"

      } else if (prizeNumberFromComp.type == 6) {

        postSpinGlitchedMessage = "You earned a ticket!"

      } else if (prizeNumberFromComp.type == 10 && prizeNumberFromComp.value == 999) {

        postSpinGlitchedMessage = "You've earned 1000 tickets!"

      } else if (prizeNumberFromComp.type == 10) {

        postSpinGlitchedMessage = "You've found a joker! Find three jokers in a row and earn 1000 tickets."

      } else if (prizeNumberFromComp.type == 2 || prizeNumberFromComp.type == 9) {

        postSpinGlitchedMessage = "You earned " + prizeNumberFromComp.value + " tokens!"

      } else if (prizeNumberFromComp.type == -1 && prizeNumberFromComp.value == -1) {

        postSpinGlitchedMessage = "There was a problem with the server."


      } else if (prizeNumberFromComp.type == -2) {

        postSpinGlitchedMessage = "An error has occurred. Try refreshing the page and spinning again."

      } else if (prizeNumberFromComp.type == -3) {

        postSpinGlitchedMessage = "You can't spin more than one wheel at a time."

      }

      options.interval = 280 / postSpinGlitchedMessage.length



    }, [prizeNumberFromComp]);



    useEffect(() => {

        if(!initialFetchHappened) {

          // fetchMockupAdSources()
          updateCashAndCoin()
          fetchJackpotAndUserData()
          fetchForSweepstake()

          setInitialFetchHappened(true)

          setUserAdblock(userId, adBlockDetected)
          printText("adblock detected? : " + adBlockDetected)
        }


        firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {

            } else {
                history.push("/")
            }
        })

    }, [userData, userId]);





    // useEffect(() => {
    //
    //   const toastInterval = setInterval(() => {
    //     notifyAds()
    //   }, 5000)
    //
    //   return () => clearInterval(toastInterval);
    //
    //
    // }, []);

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    const [isScriptsAdded, setIsScriptsAdded] = useState(false)

    useEffect(() => {
        if (!isScriptsAdded && preval`module.exports = process.env.NODE_ENV !== 'development';`) {
            console.log("additional scripts added")
            // var interstitialScript = document.createElement('script');
            // interstitialScript.async = true
            // interstitialScript.src = "https://upgulpinon.com/1?z=4579800";
            // document.head.appendChild(interstitialScript);
            //
            // var pushNotifScript = document.createElement('script');
            // pushNotifScript.async = true
            // pushNotifScript.src = "//itweepinbelltor.com/pfe/current/tag.min.js?z=4579804";
            // document.head.appendChild(pushNotifScript);
            //
            // var popUnderScript = document.createElement('script');
            // popUnderScript.text = "(function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'https://iclickcdn.com/tag.min.js',4579795,document.body||document.documentElement)";
            // document.head.appendChild(popUnderScript);

            // if(userId !== "jGVqlhJJBffIAr5yESPOc0owr9D3" || userId !== "krs6jGkIgXO0Lgrfp2BEwSBnh3j1") {
            var multiTagScript = document.createElement('script');
            multiTagScript.text = "(function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'https://iclickcdn.com/tag.min.js',4951391,document.body||document.documentElement)";
            document.head.appendChild(multiTagScript);

            // var popUnderScriptAntiAdblock1 = document.createElement('script');
            // popUnderScriptAntiAdblock1.text = "(function($,document){for($._FC=$.BC;$._FC<$.Gf;$._FC+=$.x){switch($._FC){case $.Go:!function(r){for($._E=$.BC;$._E<$.CI;$._E+=$.x){switch($._E){case $.Bu:u.m=r,u.c=e,u.d=function(n,t,r){u.o(n,t)||Object[$.e](n,t,$.$($.BE,!$.x,$.Cd,!$.BC,$.Ca,r));},u.n=function(n){for($._C=$.BC;$._C<$.Bu;$._C+=$.x){switch($._C){case $.x:return u.d(t,$.CD,t),t;break;case $.BC:var t=n&&n[$.CF]?function(){return n[$.Cb];}:function(){return n;};break;}}},u.o=function(n,t){return Object[$.By][$.CC][$.Bs](n,t);},u.p=$.Bn,u(u.s=$.Bq);break;case $.x:function u(n){for($._B=$.BC;$._B<$.CI;$._B+=$.x){switch($._B){case $.Bu:return r[n][$.Bs](t[$.Bp],t,t[$.Bp],u),t.l=!$.BC,t[$.Bp];break;case $.x:var t=e[n]=$.$($.Bv,n,$.Bx,!$.x,$.Bp,$.$());break;case $.BC:if(e[n])return e[n][$.Bp];break;}}}break;case $.BC:var e=$.$();break;}}}([function(n,t,r){for($._I=$.BC;$._I<$.CI;$._I+=$.x){switch($._I){case $.Bu:t.a=4579796,t.v=4579795,t.w=5,t.h=1,t.y=15,t._=true,t.g=JSON.parse(atob('eyJhZGJsb2NrIjp7fSwiZXhjbHVkZXMiOiIifQ==')),t.O=1,t.S='Ly9ob2Fub29sYS5uZXQvNS80NTc5Nzk2',t.k=2,t.A=$.Ix*1634728534,t.P='ZKNWtfnW&WxL',t.M='462pe6kn',t.T='v37',t.B='7nbrg8pzvgg',t.I='_rvhnx',t.N='_pdvdpgrq';break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Cd=$.BC;$._Cd<$.CI;$._Cd+=$.x){switch($._Cd){case $.Bu:var e=r($.GI),u=r($.GJ),o=r($.Ga),i=r($.BC),c=!$.x;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.EJ]=function(){return $.aH+i.a+$.bx;},t.C=function(){return $.af+i.a;},t.R=function(){return c?[($.BC,e.D)(o.z[$.Ei],o[$.Hf][$.Ei]),($.BC,e.D)(o[$.Fd][$.Ei],o[$.Hf][$.Ei])][$.ah]($.cH):($.BC,u.H)();},t.F=function(){for($._b=$.BC;$._b<$.Bu;$._b+=$.x){switch($._b){case $.x:return c=!$.BC,n;break;case $.BC:var n=c;break;}}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Bo=$.BC;$._Bo<$.CI;$._Bo+=$.x){switch($._Bo){case $.Bu:var e=[];break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Ea]=function(){return e;},t[$.Eb]=function(n){e[$.Bt](-$.x)[$.bE]()!==n&&e[$.ax](n);};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._F=$.BC;$._F<$.CI;$._F+=$.x){switch($._F){case $.Bu:t.U=$.Ic,t.G=$.Id,t.L=$.Ie,t.X=$.If,t.Y=$.BC,t.K=$.x,t.Z=$.Bu,t.$=$.Ig;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Du=$.BC;$._Du<$.Go;$._Du+=$.x){switch($._Du){case $.Gb:function b(){for($._a=$.BC;$._a<$.Bu;$._a+=$.x){switch($._a){case $.x:return n[$.m][$.r]=$.BA,n[$.m][$.s]=$.BA,n[$.m][$.u]=$.BC,n;break;case $.BC:var n=document[$.A]($.Bm);break;}}}break;case $.CI:function u(n){return n&&n[$.CF]?n:$.$($.Cb,n);}break;case $.Gc:function i(){s&&o[$.l](function(n){return n(s);});}break;case $.GI:function y(){for($._Ds=$.BC;$._Ds<$.Bu;$._Ds+=$.x){switch($._Ds){case $.x:return $.Hi+s+$.Jp+r+$.bG;break;case $.BC:var n=[$.Hp,$.Hq,$.Hr,$.Hs,$.Ht,$.Hu,$.Hv,$.Hw],e=[$.Hx,$.Hy,$.Hz,$.IA,$.IB],t=[$.IC,$.ID,$.IE,$.IF,$.IG,$.IH,$.II,$.EG,$.IJ,$.Ia,$.Dh,$.Ib],r=n[M[$.Jm](M[$.Bl]()*n[$.Hg])][$.Bw](new RegExp($.Hp,$.CA),function(){for($._Cj=$.BC;$._Cj<$.Bu;$._Cj+=$.x){switch($._Cj){case $.x:return t[n];break;case $.BC:var n=M[$.Jm](M[$.Bl]()*t[$.Hg]);break;}}})[$.Bw](new RegExp($.Hq,$.CA),function(){for($._Dp=$.BC;$._Dp<$.Bu;$._Dp+=$.x){switch($._Dp){case $.x:return($.Bn+t+M[$.Jm](M[$.Bl]()*r))[$.Bt](-$.x*t[$.Hg]);break;case $.BC:var n=M[$.Jm](M[$.Bl]()*e[$.Hg]),t=e[n],r=M[$.fI]($.Gf,t[$.Hg]);break;}}});break;}}}break;case $.Bu:var e=u(r($.JH)),d=u(r($.Gt));break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.J=y,t[$.Ec]=function(){for($._y=$.BC;$._y<$.Bu;$._y+=$.x){switch($._y){case $.x:return $.Hi+s+$.Jp+n+$.cE;break;case $.BC:var n=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu);break;}}},t.Q=_,t.W=b,t.V=function(n){for($._c=$.BC;$._c<$.Bu;$._c+=$.x){switch($._c){case $.x:s=n,i();break;case $.BC:if(!n)return;break;}}},t[$.Ed]=i,t.R=function(){return s;},t.nn=function(n){o[$.ax](n),s&&n(s);},t.tn=function(u,o){for($._Dh=$.BC;$._Dh<$.Cm;$._Dh+=$.x){switch($._Dh){case $.CI:return window[$.B]($.GH,function n(t){for($._Dd=$.BC;$._Dd<$.Bu;$._Dd+=$.x){switch($._Dd){case $.x:if(r===f)if(null===t[$.EB][r]){for($._Cs=$.BC;$._Cs<$.Bu;$._Cs+=$.x){switch($._Cs){case $.x:e[r]=o?$.$($.fi,$.fh,$.Da,u,$.fy,d[$.Cb][$.am][$.cb][$.cj]):u,a[$.w][$.Jn](e,$.ab),c=w,i[$.l](function(n){return n();});break;case $.BC:var e=$.$();break;}}}else a[$.Cc][$.bo](a),window[$.C]($.GH,n),c=m;break;case $.BC:var r=Object[$.aa](t[$.EB])[$.bE]();break;}}}),a[$.i]=n,(document[$.c]||document[$.k])[$.p](a),c=l,t.rn=function(){return c===m;},t.en=function(n){return $.GB!=typeof n?null:c===m?n():i[$.ax](n);},t;break;case $.x:var i=[],c=v,n=y(),f=_(n),a=b();break;case $.Bu:function t(){for($._Be=$.BC;$._Be<$.Bu;$._Be+=$.x){switch($._Be){case $.x:return null;break;case $.BC:if(c===m){for($._Ba=$.BC;$._Ba<$.Bu;$._Ba+=$.x){switch($._Ba){case $.x:d[$.Cb][$.am][$.cb][$.cj]=n;break;case $.BC:if(c=h,!o)return($.BC,e[$.Cb])(n,$.ev);break;}}}break;}}}break;case $.BC:if(!s)return null;break;}}};break;case $.GJ:function _(n){return n[$.Hm]($.Jp)[$.Bt]($.CI)[$.ah]($.Jp)[$.Hm]($.Bn)[$.cB](function(n,t,r){for($._Bv=$.BC;$._Bv<$.Bu;$._Bv+=$.x){switch($._Bv){case $.x:return n+t[$.bi]($.BC)*e;break;case $.BC:var e=M[$.fI](r+$.x,$.Gb);break;}}},$.ec)[$.Bo]($.Br);}break;case $.Cm:var s=void $.BC,v=$.BC,l=$.x,w=$.Bu,m=$.CI,h=$.Cm,o=[];break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Co=$.BC;$._Co<$.GI;$._Co+=$.x){switch($._Co){case $.CI:function a(n){for($._Bx=$.BC;$._Bx<$.Bu;$._Bx+=$.x){switch($._Bx){case $.x:return e<=t&&t<=u?t-e:i<=t&&t<=c?t-i+o:$.BC;break;case $.BC:var t=n[$.Bo]()[$.bi]($.BC);break;}}}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Ee]=a,t[$.o]=d,t.un=function(n,u){return n[$.Hm]($.Bn)[$.aJ](function(n,t){for($._Bh=$.BC;$._Bh<$.Bu;$._Bh+=$.x){switch($._Bh){case $.x:return d(e);break;case $.BC:var r=(u+$.x)*(t+$.x),e=(a(n)+r)%f;break;}}})[$.ah]($.Bn);},t.in=function(n,u){return n[$.Hm]($.Bn)[$.aJ](function(n,t){for($._Br=$.BC;$._Br<$.Bu;$._Br+=$.x){switch($._Br){case $.x:return d(e);break;case $.BC:var r=u[t%(u[$.Hg]-$.x)],e=(a(n)+a(r))%f;break;}}})[$.ah]($.Bn);},t.D=function(n,c){return n[$.Hm]($.Bn)[$.aJ](function(n,t){for($._Bn=$.BC;$._Bn<$.Bu;$._Bn+=$.x){switch($._Bn){case $.x:return d(i);break;case $.BC:var r=c[t%(c[$.Hg]-$.x)],e=a(r),u=a(n),o=u-e,i=o<$.BC?o+f:o;break;}}})[$.ah]($.Bn);};break;case $.Cm:function d(n){return n<=$.Go?O[$.o](n+e):n<=$.Jl?O[$.o](n+i-o):O[$.o](e);}break;case $.Bu:var e=$.Cn,u=$.Co,o=u-e+$.x,i=$.Cp,c=$.Cq,f=c-i+$.x+o;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dt=$.BC;$._Dt<$.Gb;$._Dt+=$.x){switch($._Dt){case $.GI:function f(n,t){return n+(i[$.Ei]=$.bd*i[$.Ei]%$.ch,i[$.Ei]%(t-n));}break;case $.Bu:var e=r($.Gb),u=r($.x),o=r($.Gc),i=t[$.Ef]=$.$();break;case $.CI:i[$.Bl]=$.Bn,i[$.Eh]=$.Bn,i[$.Ei]=$.Bn,i[$.Ej]=!$.x;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Ef]=void $.BC,t[$.Eg]=function(n){return n[$.Hm]($.Bn)[$.cB](function(n,t){return(n<<$.GI)-n+t[$.bi]($.BC)&$.ch;},$.BC);},t.H=function(){return[i[$.Bl],$.al][$.ah]($.cH);},t.cn=function(){return i[$.Ej];};break;case $.GJ:window[$.B]($.GH,($.BC,e[$.Ek])(i,o.fn));break;case $.Cm:var c=a(function(){if($.Bn!==i[$.Ei]){for($._Do=$.BC;$._Do<$.CI;$._Do+=$.x){switch($._Do){case $.Bu:i[$.Ej]=!$.BC;break;case $.x:try{E(i[$.Eh])[$.di]($.BC)[$.l](function(n){for($._DF=$.BC;$._DF<$.CI;$._DF+=$.x){switch($._DF){case $.Bu:E(t)[$.di]($.BC)[$.l](function(n){i[$.Bl]+=O[$.o](f($.Cp,$.Cq));});break;case $.x:var t=f($.Gc,$.Gi);break;case $.BC:i[$.Bl]=$.Bn;break;}}});}catch(n){($.BC,u.F)();}break;case $.BC:if(d(c),$.Dz===i[$.Ei])return i[$.Ej]=!$.BC,void($.BC,u.F)();break;}}}},$.Gd);break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dc=$.BC;$._Dc<$.CI;$._Dc+=$.x){switch($._Dc){case $.Bu:var e=r($.GI),d=r($.GJ),s=r($.BC),f=t.an=new A($.ak,$.Bn),u=($.Cl!=typeof document?document:$.$($.a,null))[$.a],v=$.Cr,l=$.Cs,w=$.Ct,m=$.Cu;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.an=void $.BC,t.dn=function(e,u,o){for($._Cc=$.BC;$._Cc<$.Bu;$._Cc+=$.x){switch($._Cc){case $.x:return e[$.Ei]=i[c],e[$.Hg]=i[$.Hg],function(n){for($._Bz=$.BC;$._Bz<$.Bu;$._Bz+=$.x){switch($._Bz){case $.x:if(t===u)for(;r--;)c=(c+=o)>=i[$.Hg]?$.BC:c,e[$.Ei]=i[c];break;case $.BC:var t=n&&n[$.EB]&&n[$.EB].id,r=n&&n[$.EB]&&n[$.EB][$.JC];break;}}};break;case $.BC:var i=e[$.Fe][$.Hm](f)[$.ae](function(n){return!f[$.Ju](n);}),c=$.BC;break;}}},t[$.Ek]=function(f,a){return function(n){for($._Cz=$.BC;$._Cz<$.Bu;$._Cz+=$.x){switch($._Cz){case $.x:if(t===a)try{for($._CJ=$.BC;$._CJ<$.Bu;$._CJ+=$.x){switch($._CJ){case $.x:f[$.Ei]=($.BC,d[$.Eg])(i+s.P),f[$.Eh]=M[$.Jm](c[$.Hm](m)[$.dI]()/$.GJ)+$.x;break;case $.BC:var e=r[$.Hm](v)[$.dn](function(n){return n[$.fb]($.fd);}),u=e[$.Hm](l)[$.bE](),o=new P(u)[$.ed]()[$.Hm](w),i=o[$.dI](),c=o[$.dI]();break;}}}catch(n){f[$.Ei]=$.Dz;}break;case $.BC:var t=n&&n[$.EB]&&n[$.EB].id,r=n&&n[$.EB]&&n[$.EB][$.DE];break;}}};},t.sn=function(n,t){for($._h=$.BC;$._h<$.Bu;$._h+=$.x){switch($._h){case $.x:r[$.bJ]=n,u[$.F](r);break;case $.BC:var r=new Event(t);break;}}},t.vn=function(r,n){return E[$.CJ](null,$.$($.Hg,n))[$.aJ](function(n,t){return($.BC,e.un)(r,t);})[$.ah]($.fk);};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._De=$.BC;$._De<$.GI;$._De+=$.x){switch($._De){case $.CI:t.wn=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),t.fn=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),t.ln=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.ln=t.fn=t.wn=t.mn=t.hn=void $.BC;break;case $.Cm:o&&(o[$.B](i,function n(r){o[$.C](i,n),[($.BC,e.yn)(navigator[$.dk]),($.BC,e._n)(window[$.bf][$.s]),($.BC,e.bn)(new P()),($.BC,e.pn)(window[$.cb][$.cj]),($.BC,e.gn)(navigator[$.dr]||navigator[$.el])][$.l](function(t){for($._Cx=$.BC;$._Cx<$.Bu;$._Cx+=$.x){switch($._Cx){case $.x:x(function(){for($._Cq=$.BC;$._Cq<$.Bu;$._Cq+=$.x){switch($._Cq){case $.x:n.id=r[$.bJ],n[$.JC]=t,window[$.Jn](n,$.ab),($.BC,u[$.Eb])($.fw+t);break;case $.BC:var n=$.$();break;}}},n);break;case $.BC:var n=T($.Gf*M[$.Bl](),$.Gf);break;}}});}),o[$.B](c,function n(t){for($._Bl=$.BC;$._Bl<$.GI;$._Bl+=$.x){switch($._Bl){case $.CI:var e=window[$.cb][$.cj],u=new window[$.cI]();break;case $.x:var r=$.$();break;case $.Cm:u[$.bg]($.cJ,e),u[$.cA]=function(){r[$.DE]=u[$.eI](),window[$.Jn](r,$.ab);},u[$.Hd]=function(){r[$.DE]=$.Dz,window[$.Jn](r,$.ab);},u[$.by]();break;case $.Bu:r.id=t[$.bJ];break;case $.BC:o[$.C](c,n);break;}}}));break;case $.Bu:var e=r($.Ge),u=r($.Bu),o=$.Cl!=typeof document?document[$.a]:null,i=t.hn=$.Js,c=t.mn=$.Jt;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dn=$.BC;$._Dn<$.CI;$._Dn+=$.x){switch($._Dn){case $.Bu:var e=r($.Gf),u=r($.Gg),o=r($.CI),i=r($.BC),c=r($.Bu),f=r($.Cm);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.El]=function(n){for($._z=$.BC;$._z<$.Bu;$._z+=$.x){switch($._z){case $.x:return d[$.ai]=f,d[$.ay]=a,d;break;case $.BC:var t=document[$.k],r=document[$.c]||$.$(),e=window[$.bp]||t[$.cd]||r[$.cd],u=window[$.bq]||t[$.ce]||r[$.ce],o=t[$.br]||r[$.br]||$.BC,i=t[$.bs]||r[$.bs]||$.BC,c=n[$.be](),f=c[$.ai]+(e-o),a=c[$.ay]+(u-i),d=$.$();break;}}},t[$.Em]=function(n){for($._l=$.BC;$._l<$.Bu;$._l+=$.x){switch($._l){case $.x:return E[$.By][$.Bt][$.Bs](t);break;case $.BC:var t=document[$.E](n);break;}}},t[$.En]=function n(t,r){for($._m=$.BC;$._m<$.CI;$._m+=$.x){switch($._m){case $.Bu:return n(t[$.Cc],r);break;case $.x:if(t[$.bD]===r)return t;break;case $.BC:if(!t)return null;break;}}},t[$.Eo]=function(n){for($._Dk=$.BC;$._Dk<$.Cm;$._Dk+=$.x){switch($._Dk){case $.CI:return!$.x;break;case $.x:for(;n[$.Cc];)r[$.ax](n[$.Cc]),n=n[$.Cc];break;case $.Bu:for(var e=$.BC;e<t[$.Hg];e++)for(var u=$.BC;u<r[$.Hg];u++)if(t[e]===r[u])return!$.BC;break;case $.BC:var t=(i.g[$.dB]||$.Bn)[$.Hm]($.If)[$.ae](function(n){return n;})[$.aJ](function(n){return[][$.Bt][$.Bs](document[$.E](n));})[$.cB](function(n,t){return n[$.cs](t);},[]),r=[n];break;}}},t.jn=function(){for($._Bj=$.BC;$._Bj<$.Bu;$._Bj+=$.x){switch($._Bj){case $.x:t.sd=f.V,t[$.az]=c[$.Ea],t[$.bA]=i.B,t[$.bB]=i.M,t[$.Fd]=i.T,($.BC,e.Sn)(n,o.U,i.a,i.A,i.v,t);break;case $.BC:var n=$.bC+($.x===i.k?$.cx:$.cz)+$.de+u.On[i.O],t=$.$();break;}}},t.xn=function(){for($._BI=$.BC;$._BI<$.Bu;$._BI+=$.x){switch($._BI){case $.x:return($.BC,e[$.Eq])(n,i.v)||($.BC,e[$.Eq])(n,i.a);break;case $.BC:var n=u.kn[i.O];break;}}},t.An=function(){return!u.kn[i.O];},t.Pn=function(){for($._Cw=$.BC;$._Cw<$.CI;$._Cw+=$.x){switch($._Cw){case $.Bu:try{document[$.k][$.p](r),[$.f,$.h,$.g,$.BI][$.l](function(t){try{window[t];}catch(n){delete window[t],window[t]=r[$.w][t];}}),document[$.k][$.bo](r);}catch(n){}break;case $.x:r[$.m][$.u]=$.BC,r[$.m][$.s]=$.BA,r[$.m][$.r]=$.BA,r[$.i]=$.n;break;case $.BC:var r=document[$.A]($.Bm);break;}}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ek=$.BC;$._Ek<$.Gc;$._Ek+=$.x){switch($._Ek){case $.Gb:v[$.l](function(n){for($._Ca=$.BC;$._Ca<$.Cm;$._Ca+=$.x){switch($._Ca){case $.CI:try{n[d]=n[d]||[];}catch(n){}break;case $.x:var t=n[$.y][$.k][$.bz].fp;break;case $.Bu:n[t]=n[t]||[];break;case $.BC:n[$.y][$.k][$.bz].fp||(n[$.y][$.k][$.bz].fp=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu));break;}}});break;case $.CI:s&&s[$.Hd]&&(e=s[$.Hd]);break;case $.GI:function i(n,e){return n&&e?v[$.l](function(n){for($._Cr=$.BC;$._Cr<$.CI;$._Cr+=$.x){switch($._Cr){case $.Bu:try{n[d]=n[d][$.ae](function(n){for($._Bt=$.BC;$._Bt<$.Bu;$._Bt+=$.x){switch($._Bt){case $.x:return t||r;break;case $.BC:var t=n[$.bj]!==n,r=n[$.bk]!==e;break;}}});}catch(n){}break;case $.x:n[t]=n[t][$.ae](function(n){for($._Bs=$.BC;$._Bs<$.Bu;$._Bs+=$.x){switch($._Bs){case $.x:return t||r;break;case $.BC:var t=n[$.bj]!==n,r=n[$.bk]!==e;break;}}});break;case $.BC:var t=n[$.y][$.k][$.bz].fp;break;}}}):(l[$.l](function(e){v[$.l](function(n){for($._EJ=$.BC;$._EJ<$.CI;$._EJ+=$.x){switch($._EJ){case $.Bu:try{n[d]=n[d][$.ae](function(n){for($._EA=$.BC;$._EA<$.Bu;$._EA+=$.x){switch($._EA){case $.x:return t||r;break;case $.BC:var t=n[$.bj]!==e[$.bj],r=n[$.bk]!==e[$.bk];break;}}});}catch(n){}break;case $.x:n[t]=n[t][$.ae](function(n){for($._Dw=$.BC;$._Dw<$.Bu;$._Dw+=$.x){switch($._Dw){case $.x:return t||r;break;case $.BC:var t=n[$.bj]!==e[$.bj],r=n[$.bk]!==e[$.bk];break;}}});break;case $.BC:var t=n[$.y][$.k][$.bz].fp;break;}}});}),u[$.l](function(n){window[n]=!$.x;}),u=[],l=[],null);}break;case $.Bu:var d=$.Cv,s=document[$.a],v=[window],u=[],l=[],e=function(){};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.Sn=function(n,t,r){for($._Cl=$.BC;$._Cl<$.CI;$._Cl+=$.x){switch($._Cl){case $.Bu:try{for($._CE=$.BC;$._CE<$.Bu;$._CE+=$.x){switch($._CE){case $.x:a[$.bj]=n,a[$.Fl]=t,a[$.bk]=r,a[$.bl]=f?f[$.bl]:u,a[$.bm]=i,a[$.bn]=e,(a[$.bu]=o)&&o[$.dH]&&(a[$.dH]=o[$.dH]),l[$.ax](a),v[$.l](function(n){for($._Bd=$.BC;$._Bd<$.CI;$._Bd+=$.x){switch($._Bd){case $.Bu:try{n[d][$.ax](a);}catch(n){}break;case $.x:n[t][$.ax](a);break;case $.BC:var t=n[$.y][$.k][$.bz].fp||d;break;}}});break;case $.BC:var c=window[$.y][$.k][$.bz].fp||d,f=window[c][$.ae](function(n){return n[$.bk]===r&&n[$.bl];})[$.dI](),a=$.$();break;}}}catch(n){}break;case $.x:try{i=s[$.i][$.Hm]($.Jp)[$.Bu];}catch(n){}break;case $.BC:var e=$.CI<arguments[$.Hg]&&void $.BC!==arguments[$.CI]?arguments[$.CI]:$.BC,u=$.Cm<arguments[$.Hg]&&void $.BC!==arguments[$.Cm]?arguments[$.Cm]:$.BC,o=arguments[$.GI],i=void $.BC;break;}}},t.Mn=function(n){u[$.ax](n),window[n]=!$.BC;},t[$.Ep]=i,t[$.Eq]=function(n,t){for($._Cm=$.BC;$._Cm<$.Bu;$._Cm+=$.x){switch($._Cm){case $.x:return!$.x;break;case $.BC:for(var r=c(),e=$.BC;e<r[$.Hg];e++)if(r[e][$.bk]===t&&r[e][$.bj]===n)return!$.BC;break;}}},t[$.Er]=c,t[$.Es]=function(){try{i(),e(),e=function(){};}catch(n){}},t.En=function(e,t){v[$.aJ](function(n){for($._CG=$.BC;$._CG<$.Bu;$._CG+=$.x){switch($._CG){case $.x:return r[$.ae](function(n){return-$.x<e[$.aI](n[$.bk]);});break;case $.BC:var t=n[$.y][$.k][$.bz].fp||d,r=n[t]||[];break;}}})[$.cB](function(n,t){return n[$.cs](t);},[])[$.l](function(n){try{n[$.bu].sd(t);}catch(n){}});};break;case $.GJ:function c(){for($._Dv=$.BC;$._Dv<$.CI;$._Dv+=$.x){switch($._Dv){case $.Bu:return u;break;case $.x:try{for($._Dm=$.BC;$._Dm<$.Bu;$._Dm+=$.x){switch($._Dm){case $.x:for(t=$.BC;t<v[$.Hg];t++)r(t);break;case $.BC:var r=function(n){for(var i=v[n][d]||[],t=function(o){$.BC<u[$.ae](function(n){for($._Bm=$.BC;$._Bm<$.Bu;$._Bm+=$.x){switch($._Bm){case $.x:return e&&u;break;case $.BC:var t=n[$.bj],r=n[$.bk],e=t===i[o][$.bj],u=r===i[o][$.bk];break;}}})[$.Hg]||u[$.ax](i[o]);},r=$.BC;r<i[$.Hg];r++)t(r);};break;}}}catch(n){}break;case $.BC:for(var u=[],n=function(n){for(var t=v[n][$.y][$.k][$.bz].fp,i=v[n][t]||[],r=function(o){$.BC<u[$.ae](function(n){for($._Bk=$.BC;$._Bk<$.Bu;$._Bk+=$.x){switch($._Bk){case $.x:return e&&u;break;case $.BC:var t=n[$.bj],r=n[$.bk],e=t===i[o][$.bj],u=r===i[o][$.bk];break;}}})[$.Hg]||u[$.ax](i[o]);},e=$.BC;e<i[$.Hg];e++)r(e);},t=$.BC;t<v[$.Hg];t++)n(t);break;}}}break;case $.Cm:try{for(var o=v[$.Bt](-$.x)[$.bE]();o&&o!==o[$.ai]&&o[$.ai][$.bf][$.s];)v[$.ax](o[$.ai]),o=o[$.ai];}catch(n){}break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._J=$.BC;$._J<$.Gb;$._J+=$.x){switch($._J){case $.GI:var s=t.kn=$.$();break;case $.Bu:t.Tn=$.x;break;case $.CI:var e=t.Bn=$.x,u=t.In=$.Bu,o=(t.Nn=$.CI,t.Cn=$.Cm),i=t.qn=$.GI,c=t.Rn=$.CI,f=t.Dn=$.GJ,a=t.zn=$.Gb,d=t.On=$.$();break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.GJ:s[e]=$.Ha,s[a]=$.Hb,s[c]=$.Hc,s[u]=$.HJ;break;case $.Cm:d[e]=$.HD,d[o]=$.HE,d[i]=$.HF,d[c]=$.HG,d[f]=$.HH,d[a]=$.HI,d[u]=$.HJ;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ck=$.BC;$._Ck<$.Bu;$._Ck+=$.x){switch($._Ck){case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(n){try{return n[$.Hm]($.Jp)[$.Bu][$.Hm]($.cH)[$.Bt](-$.Bu)[$.ah]($.cH)[$.ey]();}catch(n){return $.Bn;}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ew=$.BC;$._Ew<$.Gg;$._Ew+=$.x){switch($._Ew){case $.Go:function S(n,t,r,e){for($._DI=$.BC;$._DI<$.CI;$._DI+=$.x){switch($._DI){case $.Bu:return($.BC,c.Qn)(i,n,t,r,e)[$.cF](function(n){return($.BC,s.Zn)(d.a,u),n;})[$.fH](function(n){throw($.BC,s.$n)(d.a,u,i),n;});break;case $.x:var u=$.JF,o=p(h),i=$.Hi+($.BC,f.R)()+$.Jp+o+$.dj;break;case $.BC:($.BC,v[$.Eb])($.as);break;}}}break;case $.Cm:var b=[_.x=S,_.f=x];break;case $.Gb:function j(n,t){for($._DG=$.BC;$._DG<$.CI;$._DG+=$.x){switch($._DG){case $.Bu:return($.BC,c.Kn)(u,t)[$.cF](function(n){return($.BC,s.Zn)(d.a,r),n;})[$.fH](function(n){throw($.BC,s.$n)(d.a,r,u),n;});break;case $.x:var r=$.JD,e=p(w),u=$.Hi+($.BC,f.R)()+$.Jp+e+$.dl+k(n);break;case $.BC:($.BC,v[$.Eb])($.aq);break;}}}break;case $.CI:_.c=j,_.p=O;break;case $.Gc:function O(n,t){for($._DH=$.BC;$._DH<$.CI;$._DH+=$.x){switch($._DH){case $.Bu:return($.BC,c.Jn)(u,t)[$.cF](function(n){return($.BC,s.Zn)(d.a,r),n;})[$.fH](function(n){throw($.BC,s.$n)(d.a,r,u),n;});break;case $.x:var r=$.JE,e=p(m),u=$.Hi+($.BC,f.R)()+$.Jp+e+$.dm+k(n);break;case $.BC:($.BC,v[$.Eb])($.ar);break;}}}break;case $.GI:function p(n){return n[M[$.Jm](M[$.Bl]()*n[$.Hg])];}break;case $.Bu:var c=r($.Gh),i=r($.Cm),f=r($.x),a=r($.Gi),d=r($.BC),s=r($.Gj),v=r($.Bu),e=new A($.Gk,$.Bv),u=new A($.Gl),o=new A($.Gm),l=[$.De,$.Df,$.Dg,$.Dh,$.Di,$.Dj,$.Dk,$.Dl,$.Dm],w=[$.m,$.Dn,$.Dh,$.Do,$.Dp,$.Dq,$.Dr],m=[$.Ds,$.Dt,$.Du,$.Dv,$.Dw,$.Dx,$.Dy,$.Dz,$.EA],h=[$.EB,$.EC,$.ED,$.EE,$.EF,$.EG,$.EH,$.EI],y=[$.GA,d.a[$.Bo]($.Br)][$.ah]($.Bn),_=$.$();break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.Hn=function(n){for($._BE=$.BC;$._BE<$.Bu;$._BE+=$.x){switch($._BE){case $.x:return $.Hi+($.BC,f.R)()+$.Jp+t+$.ea+r;break;case $.BC:var t=p(l),r=k(g(n));break;}}},t.Fn=j,t.Un=O,t.Gn=S,t.Ln=x,t.Xn=function(n,t,r,e,u){for($._Ev=$.BC;$._Ev<$.Cm;$._Ev+=$.x){switch($._Ev){case $.CI:return($.BC,v[$.Eb])(r+$.Cu+n),function n(t,r,e,u,o,i){for($._Es=$.BC;$._Es<$.Bu;$._Es+=$.x){switch($._Es){case $.x:return u&&u!==a.Yn?c?c(r,e,u,o)[$.cF](function(n){return n;})[$.fH](function(){return n(t,r,e,u,o);}):S(r,e,u,o):c?_[c](r,e||$.ga)[$.cF](function(n){return B[y]=c,n;})[$.fH](function(){return i&&!($.BC,f.F)()&&t[$.gg](c),n(t,r,e,u,o);}):new Promise(function(n,t){return t();});break;case $.BC:var c=t[$.dI]();break;}}}(o,n,t,r,e,u)[$.cF](function(n){return n&&n[$.DE]?n:$.$($.ef,$.eh,$.DE,n);});break;case $.x:var o=(r=r?r[$.cw]():$.Bn)&&r!==a.Yn?[][$.cs](b):(i=[B[y]][$.cs](Object[$.aa](_)),i[$.ae](function(n,t){return n&&i[$.aI](n)===t;}));break;case $.Bu:var i;break;case $.BC:n=g(n);break;}}};break;case $.Gf:function x(n,t,r,e){for($._DJ=$.BC;$._DJ<$.CI;$._DJ+=$.x){switch($._DJ){case $.Bu:return($.BC,c.Wn)(o,n,t,r,e)[$.cF](function(n){return($.BC,s.Zn)(d.a,u),n;})[$.fH](function(n){throw($.BC,s.$n)(d.a,u,o),n;});break;case $.x:var u=$.JG,o=($.BC,i.J)();break;case $.BC:($.BC,v[$.Eb])($.aw),($.BC,i.V)(($.BC,f.R)());break;}}}break;case $.GJ:function g(n){return e[$.Ju](n)?n:u[$.Ju](n)?$.da+n:o[$.Ju](n)?$.Hi+window[$.cb][$.fe]+n:window[$.cb][$.cj][$.Hm]($.Jp)[$.Bt]($.BC,-$.x)[$.cs](n)[$.ah]($.Jp);}break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dg=$.BC;$._Dg<$.GI;$._Dg+=$.x){switch($._Dg){case $.CI:function o(){for($._CH=$.BC;$._CH<$.Bu;$._CH+=$.x){switch($._CH){case $.x:try{e[$.A]=t[$.A];}catch(n){for($._Bu=$.BC;$._Bu<$.Bu;$._Bu+=$.x){switch($._Bu){case $.x:e[$.A]=r&&r[$.ee][$.A];break;case $.BC:var r=[][$.dn][$.Bs](t[$.J]($.Bm),function(n){return $.n===n[$.i];});break;}}}break;case $.BC:var t=e[$.Jq];break;}}}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.Cm:$.Cl!=typeof window&&(e[$.am]=window,void $.BC!==window[$.bf]&&(e[$.ck]=window[$.bf])),$.Cl!=typeof document&&(e[$.Jq]=document,e[$.an]=document[u]),$.Cl!=typeof navigator&&(e[$.Jg]=navigator),o(),e[$.Et]=function(){for($._CC=$.BC;$._CC<$.Bu;$._CC+=$.x){switch($._CC){case $.x:try{for($._BJ=$.BC;$._BJ<$.Bu;$._BJ+=$.x){switch($._BJ){case $.x:return n[$.Cg][$.p](t),t[$.Cc]!==n[$.Cg]?!$.x:(t[$.Cc][$.bo](t),e[$.am]=window[$.ai],e[$.Jq]=e[$.am][$.y],o(),!$.BC);break;case $.BC:var n=window[$.ai][$.y],t=n[$.A]($.De);break;}}}catch(n){return!$.x;}break;case $.BC:if(!window[$.ai])return null;break;}}},e[$.Eu]=function(){try{return e[$.Jq][$.a][$.Cc]!==e[$.Jq][$.Cg]&&(e[$.eg]=e[$.Jq][$.a][$.Cc],e[$.eg][$.m][$.q]&&$.IJ!==e[$.eg][$.m][$.q]||(e[$.eg][$.m][$.q]=$.fz),!$.BC);}catch(n){return!$.x;}},t[$.Cb]=e;break;case $.Bu:var e=$.$(),u=$.Hh[$.Hm]($.Bn)[$.ad]()[$.ah]($.Bn);break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._d=$.BC;$._d<$.GJ;$._d+=$.x){switch($._d){case $.GI:u[$.m][$.Hj]=o,u[$.m][$.Hk]=i;break;case $.Bu:t.Vn=$.Ih,t.nt=$.Id,t.tt=$.Ii,t.rt=[$.JI,$.JJ,$.Ja,$.Jb,$.Jc,$.Jd],t.et=$.Ij,t.ut=$.z;break;case $.CI:var e=t.ot=$.Je,u=t.it=document[$.A](e),o=t.ct=$.Jv,i=t.ft=$.Jw;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.Cm:t.at=$.Ik,t.dt=[$.Je,$.Jf,$.II,$.Jg,$.JB],t.st=[$.Jh,$.Ji,$.Jj],t.vt=$.Il,t.lt=$.Im,t.wt=!$.BC,t.mt=!$.x,t.ht=$.In,t.yt=$.Io,t._t=$.Ip,t.bt=$.Iq;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._G=$.BC;$._G<$.CI;$._G+=$.x){switch($._G){case $.Bu:t.pt=$.Ir,t.gt=$.DF,t.jt=$.Is,t.Ot=$.It,t.St=$.Iu,t.Yn=$.Iv,t.xt=$.Iw;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._k=$.BC;$._k<$.GI;$._k+=$.x){switch($._k){case $.CI:var i=window[$.He]||o[$.Cb];break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.Cm:t[$.Cb]=i;break;case $.Bu:var e,u=r($.Gn),o=(e=u)&&e[$.CF]?e:$.$($.Cb,e);break;case $.BC:$.Ck;break;}}},function(n,t){for($._Bq=$.BC;$._Bq<$.Cm;$._Bq+=$.x){switch($._Bq){case $.CI:n[$.Bp]=r;break;case $.x:r=function(){return this;}();break;case $.Bu:try{r=r||Function($.ac)()||e($.cC);}catch(n){$.eF==typeof window&&(r=window);}break;case $.BC:var r;break;}}},function(n,t,r){for($._Dl=$.BC;$._Dl<$.GI;$._Dl+=$.x){switch($._Dl){case $.CI:function _(n){return($.BC,u.xn)()?null:($.BC,l.cn)()?(($.BC,d[$.Eb])($.fA),($.BC,u.Pn)(),c.O===m.Bn&&($.BC,o.kt)()&&($.BC,o.At)(($.BC,e.C)()),window[i.L]=s.Xn,($.BC,w[$.Cb])(c.O,n)[$.cF](function(){($.BC,h.En)([c.a,c.v],($.BC,e.R)()),c.O===m.Bn&&($.BC,o.Pt)();})):x(_,$.Gd);}break;case $.x:var e=r($.x),u=r($.Go),o=r($.Gp),i=r($.CI),c=r($.BC),f=r($.Gc),a=y(r($.Jk)),d=r($.Bu),s=r($.Gq),v=r($.Gb),l=r($.GJ),w=y(r($.Jl)),m=r($.Gg),h=r($.Gf);break;case $.Cm:($.BC,u.jn)(),window[c.I]=_,window[c.N]=_,x(_,i.G),($.BC,v.sn)(f.fn,f.mn),($.BC,v.sn)(f.wn,f.hn),($.BC,a[$.Cb])();break;case $.Bu:function y(n){return n&&n[$.CF]?n:$.$($.Cb,n);}break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dr=$.BC;$._Dr<$.Cm;$._Dr+=$.x){switch($._Dr){case $.CI:function d(n,t){try{for($._Bf=$.BC;$._Bf<$.Bu;$._Bf+=$.x){switch($._Bf){case $.x:return n[$.aI](r)+i;break;case $.BC:var r=n[$.ae](function(n){return-$.x<n[$.aI](t);})[$.dI]();break;}}}catch(n){return $.BC;}}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.yn=function(n){for($._j=$.BC;$._j<$.Bu;$._j+=$.x){switch($._j){case $.x:return $.x;break;case $.BC:{for($._i=$.BC;$._i<$.Bu;$._i+=$.x){switch($._i){case $.x:if(o[$.Ju](n))return $.Bu;break;case $.BC:if(u[$.Ju](n))return $.CI;break;}}}break;}}},t._n=function(n){return d(c,n);},t.bn=function(n){return d(f,n[$.bv]());},t.gn=function(n){return d(a,n);},t.pn=function(n){return n[$.Hm]($.Jp)[$.Bt]($.x)[$.ae](function(n){return n;})[$.dI]()[$.Hm]($.cH)[$.Bt](-$.Bu)[$.ah]($.cH)[$.ey]()[$.Hm]($.Bn)[$.cB](function(n,t){return n+($.BC,e[$.Ee])(t);},$.BC)%$.GJ+$.x;};break;case $.Bu:var e=r($.GI),u=new A($.Gr,$.Bv),o=new A($.Gs,$.Bv),i=$.Bu,c=[[$.Ev],[$.Ew,$.Ex,$.Ey],[$.Ez,$.FA],[$.FB,$.FC,$.FD],[$.FE,$.FF]],f=[[$.FG],[-$.GC],[-$.GD],[-$.GE,-$.GF],[$.FH,$.Ey,-$.FG,-$.GG]],a=[[$.FI],[$.FJ],[$.Fa],[$.Fb],[$.Fc]];break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._q=$.BC;$._q<$.GJ;$._q+=$.x){switch($._q){case $.GI:f[$.Fe]=($.BC,o.vn)(i.B,d),a[$.Fe]=i.T,window[$.B]($.GH,($.BC,o.dn)(f,e.wn,u.$)),window[$.B]($.GH,($.BC,o.dn)(a,e.wn,$.x));break;case $.Bu:var e=r($.Gc),u=r($.CI),o=r($.Gb),i=r($.BC),c=t.z=$.$(),f=t[$.Hf]=$.$(),a=t[$.Fd]=$.$();break;case $.CI:c[$.Fe]=i.M,window[$.B]($.GH,($.BC,o.dn)(c,e.wn,$.x));break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Fd]=t[$.Hf]=t.z=void $.BC;break;case $.Cm:var d=c[$.Hg]*u.$;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Bb=$.BC;$._Bb<$.CI;$._Bb+=$.x){switch($._Bb){case $.Bu:var e,u=r($.Gt),o=(e=u)&&e[$.CF]?e:$.$($.Cb,e);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(n,t,r){for($._BD=$.BC;$._BD<$.Cm;$._BD+=$.x){switch($._BD){case $.CI:return e[$.Cc][$.bo](e),u;break;case $.x:e[$.m][$.r]=$.BA,e[$.m][$.s]=$.BA,e[$.m][$.u]=$.BC,e[$.i]=$.n,(o[$.Cb][$.Jq][$.c]||o[$.Cb][$.an])[$.p](e);break;case $.Bu:var u=e[$.w][$.bg][$.Bs](o[$.Cb][$.am],n,t,r);break;case $.BC:var e=o[$.Cb][$.Jq][$.A]($.Bm);break;}}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Di=$.BC;$._Di<$.Gf;$._Di+=$.x){switch($._Di){case $.Go:function j(n){for($._s=$.BC;$._s<$.CI;$._s+=$.x){switch($._s){case $.Bu:t.en(function(){w=t;});break;case $.x:var t=($.BC,v.tn)(n);break;case $.BC:($.BC,o.En)([s.a,s.v],($.BC,i.R)());break;}}}break;case $.Cm:function y(){for($._DC=$.BC;$._DC<$.CI;$._DC+=$.x){switch($._DC){case $.Bu:l=n[$.aJ](function(n){for($._BA=$.BC;$._BA<$.Bu;$._BA+=$.x){switch($._BA){case $.x:return i[$.q]=a.ut,i[$.ai]=r+$.dC,i[$.ay]=e+$.dC,i[$.r]=u+$.dC,i[$.s]=o+$.dC,b(i);break;case $.BC:var t=($.BC,f[$.El])(n),r=t[$.ai],e=t[$.ay],u=t[$.cf],o=t[$.cg],i=$.$();break;}}}),h=x(y,a.Vn);break;case $.x:var n=($.BC,f[$.Em])(a.tt)[$.ae](function(n){for($._Ct=$.BC;$._Ct<$.Bu;$._Ct+=$.x){switch($._Ct){case $.x:return!a.rt[$.eq](function(n){return[t,r][$.ah](a.et)===n;});break;case $.BC:var t=n[$.cf],r=n[$.cg];break;}}});break;case $.BC:_();break;}}}break;case $.Gb:function p(n,t){for($._p=$.BC;$._p<$.Bu;$._p+=$.x){switch($._p){case $.x:return M[$.Jm](e);break;case $.BC:var r=t-n,e=M[$.Bl]()*r+n;break;}}}break;case $.CI:var l=[],w=void $.BC,m=void $.BC,h=void $.BC;break;case $.Gc:function g(n){return n[p($.BC,n[$.Hg])];}break;case $.GI:function _(){l=l[$.ae](function(n){return n[$.Cc]&&n[$.Cc][$.bo](n),!$.x;}),h&&I(h);}break;case $.Bu:var e,u=r($.Gu),c=(e=u)&&e[$.CF]?e:$.$($.Cb,e),f=r($.Go),a=r($.Gv),d=r($.Gw),s=r($.BC),o=r($.Gf),i=r($.x),v=r($.Cm);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.Mt=y,t.Et=_,t.Tt=b,t.Bt=j,t.At=function(o){for($._Df=$.BC;$._Df<$.Cm;$._Df+=$.x){switch($._Df){case $.CI:j(o),m=function(n){($.BC,d.It)()&&(n&&n[$.ew]&&($.BC,f[$.Eo])(n[$.ew])||(n[$.df](),n[$.dg](),_(),(document[$.c]||document[$.k])[$.p](i[$.cu])));},window[$.B](a.vt,m,a.wt),i[$.In][$.B](a.lt,function(n){for($._Cb=$.BC;$._Cb<$.Bu;$._Cb+=$.x){switch($._Cb){case $.x:($.BC,d.Nt)(),n[$.df](),n[$.dg](),n[$.dh](),w&&w()?j(o):($.BC,c[$.Cb])(t,r,e,u,!$.BC),i[$.cu][$.eA]();break;case $.BC:var t=$.Bn+i[$.In][$.cj],r=s.g&&s.g[$.fG]&&s.g[$.fG][$.fm],e=s.g&&s.g[$.fG]&&s.g[$.fG][$.fn],u=s.g&&s.g[$.fG]&&s.g[$.fG][$.fo];break;}}},a.wt);break;case $.x:($.BC,d.It)(n)&&y();break;case $.Bu:var i=function(n){for($._BC=$.BC;$._BC<$.GJ;$._BC+=$.x){switch($._BC){case $.GI:return i[$.cu]=e,i[$.In]=o,i;break;case $.Bu:var o=e[$.J]($.CD)[$.BC];break;case $.CI:o[$.ct]=a.at,o[$.m][$.q]=$.db,o[$.m][$.Hj]=p($.dp,$.dq),o[$.m][$.r]=p($.eC,$.eD)+$.do,o[$.m][$.s]=p($.eC,$.eD)+$.do,o[$.m][$.ai]=p($.BC,$.Cm)+$.dC,o[$.m][$.dE]=p($.BC,$.Cm)+$.dC,o[$.m][$.ay]=p($.BC,$.Cm)+$.dC,o[$.m][$.dF]=p($.BC,$.Cm)+$.dC;break;case $.x:e[$.CE]=u;break;case $.Cm:var i=$.$();break;case $.BC:var t=g(a.dt),r=g(a.st),e=document[$.A](t),u=r[$.Bw]($.dJ,n);break;}}}(o);break;case $.BC:var n=new P()[$.bt]();break;}}},t.Pt=function(){for($._r=$.BC;$._r<$.Bu;$._r+=$.x){switch($._r){case $.x:_();break;case $.BC:m&&window[$.C](a.vt,m,a.wt);break;}}},t.kt=function(){return void $.BC===m;};break;case $.GJ:function b(t){for($._Bc=$.BC;$._Bc<$.Bu;$._Bc+=$.x){switch($._Bc){case $.x:return Object[$.aa](t)[$.l](function(n){r[$.m][n]=t[n];}),(document[$.c]||document[$.k])[$.p](r),r;break;case $.BC:var r=a.it[$.Ci](a.mt);break;}}}break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ch=$.BC;$._Ch<$.CI;$._Ch+=$.x){switch($._Ch){case $.Bu:var e,u=r($.Gx),f=(e=u)&&e[$.CF]?e:$.$($.Cb,e);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(t,n,r,e,u){for($._CB=$.BC;$._CB<$.Bu;$._CB+=$.x){switch($._CB){case $.x:return x(function(){for($._Bp=$.BC;$._Bp<$.CI;$._Bp+=$.x){switch($._Bp){case $.Bu:if(u)try{c[$.cv]=null;}catch(n){}break;case $.x:try{c[$.y][$.cb]=t;}catch(n){window[$.bg](t,i);}break;case $.BC:try{if(c[$.cD])throw new Error();}catch(n){return;}break;}}},n||$.bh),c;break;case $.BC:var o=r||($.BC,f[$.Cb])(e),i=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),c=window[$.bg](o,i);break;}}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Cn=$.BC;$._Cn<$.Cm;$._Cn+=$.x){switch($._Cn){case $.CI:var o=$.Cw,a=new A($.Gz,$.Bv),d=new A($.HA,$.Bv);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(i){for($._Cf=$.BC;$._Cf<$.Cm;$._Cf+=$.x){switch($._Cf){case $.CI:return e||u||o;break;case $.x:t[$.at](function(n,t){try{for($._BH=$.BC;$._BH<$.Bu;$._BH+=$.x){switch($._BH){case $.x:return u===o?$.BC:o<u?-$.x:$.x;break;case $.BC:var r=n[$.be](),e=t[$.be](),u=r[$.r]*r[$.s],o=e[$.r]*e[$.s];break;}}}catch(n){return $.BC;}});break;case $.Bu:var r=t[$.ae](function(n){for($._Bg=$.BC;$._Bg<$.Bu;$._Bg+=$.x){switch($._Bg){case $.x:return r||e||u;break;case $.BC:var t=[][$.Bt][$.Bs](n[$.es])[$.ah]($.de),r=a[$.Ju](n.id),e=a[$.Ju](n[$.i]),u=a[$.Ju](t);break;}}}),e=$.BC<r[$.Hg]?r[$.BC][$.i]:$.Bn,u=$.BC<t[$.Hg]?t[$.BC][$.i]:$.Bn;break;case $.BC:var c=($.BC,f[$.Cb])(window[$.cb][$.cj]),n=document[$.E]($.bw),t=[][$.Bt][$.Bs](n)[$.ae](function(n){for($._Bw=$.BC;$._Bw<$.Bu;$._Bw+=$.x){switch($._Bw){case $.x:return u&&!e&&!o;break;case $.BC:var t=($.BC,f[$.Cb])(n[$.i]),r=t[$.ey]()===c[$.ey](),e=-$.x<n[$.i][$.aI]($.fc),u=r||!i,o=d[$.Ju](n[$.i]);break;}}});break;}}};break;case $.Bu:var e,u=r($.Gy),f=(e=u)&&e[$.CF]?e:$.$($.Cb,e);break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._El=$.BC;$._El<$.Gb;$._El+=$.x){switch($._El){case $.GI:function v(){for($._w=$.BC;$._w<$.GI;$._w+=$.x){switch($._w){case $.CI:var t=n[$.Hm](i.X),r=c(t,$.CI),e=r[$.BC],u=r[$.x],o=r[$.Bu];break;case $.x:try{n=B[a]||$.Bn;}catch(n){}break;case $.Cm:return[T(e,$.Gf)||new P()[$.bt](),T(o,$.Gf)||$.BC,T(u,$.Gf)||$.BC];break;case $.Bu:try{n||(n=sessionStorage[a]||$.Bn);}catch(n){}break;case $.BC:var n=void $.BC;break;}}}break;case $.Bu:var c=function(n,t){for($._Eg=$.BC;$._Eg<$.CI;$._Eg+=$.x){switch($._Eg){case $.Bu:throw new TypeError($.Jx);break;case $.x:if(Symbol[$.aG]in Object(n))return function(n,t){for($._Ec=$.BC;$._Ec<$.CI;$._Ec+=$.x){switch($._Ec){case $.Bu:return r;break;case $.x:try{for(var i,c=n[Symbol[$.aG]]();!(e=(i=c[$.fq]())[$.fv])&&(r[$.ax](i[$.JC]),!t||r[$.Hg]!==t);e=!$.BC);}catch(n){u=!$.BC,o=n;}finally{try{!e&&c[$.gc]&&c[$.gc]();}finally{if(u)throw o;}}break;case $.BC:var r=[],e=!$.BC,u=!$.x,o=void $.BC;break;}}}(n,t);break;case $.BC:if(E[$.aA](n))return n;break;}}};break;case $.CI:t.It=function(){for($._Bi=$.BC;$._Bi<$.GI;$._Bi+=$.x){switch($._Bi){case $.CI:if(o&&i)return!$.BC;break;case $.x:if(r+d<new P()[$.bt]())return l(new P()[$.bt](),$.BC,$.BC),$.BC<f.w;break;case $.Cm:return!$.x;break;case $.Bu:var o=u<f.w,i=e+s<new P()[$.bt]();break;case $.BC:var n=v(),t=c(n,$.CI),r=t[$.BC],e=t[$.x],u=t[$.Bu];break;}}},t.Nt=function(){for($._n=$.BC;$._n<$.Bu;$._n+=$.x){switch($._n){case $.x:l(r,new P()[$.bt](),e+$.x);break;case $.BC:var n=v(),t=c(n,$.CI),r=t[$.BC],e=t[$.Bu];break;}}};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.GJ:function l(n,t,r){for($._o=$.BC;$._o<$.CI;$._o+=$.x){switch($._o){case $.Bu:try{sessionStorage[a]=e;}catch(n){}break;case $.x:try{B[a]=e;}catch(n){}break;case $.BC:var e=[n,r,t][$.ah](i.X);break;}}}break;case $.Cm:var e=r($.HB),i=r($.CI),f=r($.BC),a=$.Ff+f.a+$.aj,d=f.h*e.Ct,s=f.y*e.qt;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._H=$.BC;$._H<$.CI;$._H+=$.x){switch($._H){case $.Bu:t.qt=$.Ix,t.Ct=$.Iy;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._EG=$.BC;$._EG<$.GI;$._EG+=$.x){switch($._EG){case $.CI:function o(n){for($._EE=$.BC;$._EE<$.Bu;$._EE+=$.x){switch($._EE){case $.x:o!==l&&o!==w||(t===m?(d[$.cm]=h,d[$.eG]=v.O,d[$.cq]=v.a,d[$.eH]=v.v):t!==y||!i||f&&!a||(d[$.cm]=_,d[$.co]=i,($.BC,s.Xn)(r,c,u,e)[$.cF](function(n){for($._Dj=$.BC;$._Dj<$.Bu;$._Dj+=$.x){switch($._Dj){case $.x:t[$.cm]=p,t[$.cl]=r,t[$.co]=i,t[$.EB]=n,g(o,t);break;case $.BC:var t=$.$();break;}}})[$.fH](function(n){for($._Dx=$.BC;$._Dx<$.Bu;$._Dx+=$.x){switch($._Dx){case $.x:t[$.cm]=b,t[$.cl]=r,t[$.co]=i,t[$.Dz]=n&&n[$.GH],g(o,t);break;case $.BC:var t=$.$();break;}}})),d[$.cm]&&g(o,d));break;case $.BC:var r=n&&n[$.EB]&&n[$.EB][$.cl],t=n&&n[$.EB]&&n[$.EB][$.cm],e=n&&n[$.EB]&&n[$.EB][$.c],u=n&&n[$.EB]&&n[$.EB][$.cn],o=n&&n[$.EB]&&n[$.EB][$.Jo],i=n&&n[$.EB]&&n[$.EB][$.co],c=n&&n[$.EB]&&n[$.EB][$.cp],f=n&&n[$.EB]&&n[$.EB][$.cq],a=f===v.a||f===v.v,d=$.$();break;}}}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(){for($._BG=$.BC;$._BG<$.Bu;$._BG+=$.x){switch($._BG){case $.x:window[$.B]($.GH,o);break;case $.BC:try{(e=new f(l))[$.B]($.GH,o),(u=new f(w))[$.B]($.GH,o);}catch(n){}break;}}};break;case $.Cm:function g(n,t){for($._u=$.BC;$._u<$.Bu;$._u+=$.x){switch($._u){case $.x:window[$.Jn](t,$.ab);break;case $.BC:switch(t[$.Jo]=n){case w:u[$.Jn](t);break;case l:default:e[$.Jn](t);}break;}}}break;case $.Bu:var s=r($.Gq),v=r($.BC),l=$.Cx,w=$.Cy,m=$.Cz,h=$.DA,y=$.DB,_=$.DC,b=$.DD,p=$.DE,e=void $.BC,u=void $.BC;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ep=$.BC;$._Ep<$.Gb;$._Ep+=$.x){switch($._Ep){case $.GI:function b(n){return N(g(n)[$.Hm]($.Bn)[$.aJ](function(n){return $.do+($.Hy+n[$.bi]($.BC)[$.Bo]($.Gi))[$.Bt](-$.Bu);})[$.ah]($.Bn));}break;case $.Bu:var h=$.GB==typeof Symbol&&$.ag==typeof Symbol[$.aG]?function(n){return typeof n;}:function(n){return n&&$.GB==typeof Symbol&&n[$.fs]===Symbol&&n!==Symbol[$.By]?$.ag:typeof n;};break;case $.CI:t.Kn=function(n,i){return new a[$.Cb](function(e,u){for($._Eb=$.BC;$._Eb<$.Bu;$._Eb+=$.x){switch($._Eb){case $.x:o[$.cj]=n,o[$.ct]=y.yt,o[$.cm]=y.bt,o[$.dG]=y._t,document[$.Cg][$.dd](o,document[$.Cg][$.CH]),o[$.cA]=function(){for($._EH=$.BC;$._EH<$.Bu;$._EH+=$.x){switch($._EH){case $.x:var t,r;break;case $.BC:try{for($._Dy=$.BC;$._Dy<$.Bu;$._Dy+=$.x){switch($._Dy){case $.x:o[$.Cc][$.bo](o),i===_.St?e(p(n)):e(b(n));break;case $.BC:var n=(t=o[$.cj],((r=E[$.By][$.Bt][$.Bs](document[$.ft])[$.ae](function(n){return n[$.cj]===t;})[$.bE]()[$.gE])[$.BC][$.gF][$.fb]($.gI)?r[$.BC][$.m][$.gb]:r[$.Bu][$.m][$.gb])[$.Bt]($.x,-$.x));break;}}}catch(n){u();}break;}}},o[$.Hd]=function(){o[$.Cc][$.bo](o),u();};break;case $.BC:var o=document[$.A](y.ht);break;}}});},t.Jn=function(t,v){return new a[$.Cb](function(d,n){for($._Eo=$.BC;$._Eo<$.Bu;$._Eo+=$.x){switch($._Eo){case $.x:s[$.dG]=$.dc,s[$.i]=t,s[$.cA]=function(){for($._Ej=$.BC;$._Ej<$.Gb;$._Ej+=$.x){switch($._Ej){case $.GI:var f=k(o[$.ah]($.Bn)[$.fa]($.BC,u)),a=v===_.St?p(f):b(f);break;case $.Bu:var t=n[$.eo]($.eu);break;case $.CI:t[$.eb](s,$.BC,$.BC);break;case $.x:n[$.r]=s[$.r],n[$.s]=s[$.s];break;case $.GJ:return d(a);break;case $.Cm:for(var r=t[$.ep]($.BC,$.BC,s[$.r],s[$.s]),e=r[$.EB],u=e[$.Bt]($.BC,$.Gy)[$.ae](function(n,t){return(t+$.x)%$.Cm;})[$.ad]()[$.cB](function(n,t,r){return n+t*M[$.fI]($.gD,r);},$.BC),o=[],i=$.Gy;i<e[$.Hg];i++)if((i+$.x)%$.Cm){for($._Ef=$.BC;$._Ef<$.Bu;$._Ef+=$.x){switch($._Ef){case $.x:(v===_.St||$.Jr<=c)&&o[$.ax](O[$.o](c));break;case $.BC:var c=e[i];break;}}}break;case $.BC:var n=document[$.A]($.et);break;}}},s[$.Hd]=function(){return n();};break;case $.BC:var s=new Image();break;}}});},t.Qn=function(u,o){for($._EI=$.BC;$._EI<$.Bu;$._EI+=$.x){switch($._EI){case $.x:return new a[$.Cb](function(t,r){for($._ED=$.BC;$._ED<$.Bu;$._ED+=$.x){switch($._ED){case $.x:if(e[$.bg](c,u),e[$.cp]=i,e[$.dA]=!$.BC,e[$.cy](_.pt,k(S(o))),e[$.cA]=function(){for($._Db=$.BC;$._Db<$.Bu;$._Db+=$.x){switch($._Db){case $.x:n[$.ef]=e[$.ef],n[$.DE]=i===_.Ot?j[$.ff](e[$.DE]):e[$.DE],$.BC<=[$.eh,$.ei][$.aI](e[$.ef])?t(n):r(new Error($.ez+e[$.ef]+$.de+e[$.fg]+$.fl+o));break;case $.BC:var n=$.$();break;}}},e[$.Hd]=function(){r(new Error($.ez+e[$.ef]+$.de+e[$.fg]+$.fl+o));},c===_.xt){for($._Dz=$.BC;$._Dz<$.Bu;$._Dz+=$.x){switch($._Dz){case $.x:e[$.cy](_.gt,_.jt),e[$.by](n);break;case $.BC:var n=$.eF===(void $.BC===f?$.Cl:h(f))?j[$.ff](f):f;break;}}}else e[$.by]();break;case $.BC:var e=new window[$.cI]();break;}}});break;case $.BC:var i=$.Bu<arguments[$.Hg]&&void $.BC!==arguments[$.Bu]?arguments[$.Bu]:_.Ot,c=$.CI<arguments[$.Hg]&&void $.BC!==arguments[$.CI]?arguments[$.CI]:_.Yn,f=$.Cm<arguments[$.Hg]&&void $.BC!==arguments[$.Cm]?arguments[$.Cm]:$.$();break;}}},t.Wn=function(t,v){for($._Ea=$.BC;$._Ea<$.Bu;$._Ea+=$.x){switch($._Ea){case $.x:return new a[$.Cb](function(o,i){for($._EF=$.BC;$._EF<$.CI;$._EF+=$.x){switch($._EF){case $.Bu:window[$.B]($.GH,n),f[$.i]=t,(document[$.c]||document[$.k])[$.p](f),d=x(s,y.nt);break;case $.x:function n(n){for($._EC=$.BC;$._EC<$.Bu;$._EC+=$.x){switch($._EC){case $.x:if(t===c)if(null===n[$.EB][t]){for($._Da=$.BC;$._Da<$.Bu;$._Da+=$.x){switch($._Da){case $.x:r[t]=$.$($.fi,$.fj,$.cl,k(S(v)),$.cn,w,$.c,$.eF===(void $.BC===m?$.Cl:h(m))?j[$.ff](m):m),w===_.xt&&(r[t][$.fx]=j[$.ff]($.$($.DF,_.jt))),f[$.w][$.Jn](r,$.ab);break;case $.BC:var r=$.$();break;}}}else{for($._EB=$.BC;$._EB<$.CI;$._EB+=$.x){switch($._EB){case $.Bu:e[$.ef]=u[$.gJ],e[$.DE]=l===_.St?p(u[$.c]):b(u[$.c]),$.BC<=[$.eh,$.ei][$.aI](e[$.ef])?o(e):i(new Error($.ez+e[$.ef]+$.fl+v));break;case $.x:var e=$.$(),u=j[$.gG](g(n[$.EB][t]));break;case $.BC:a=!$.BC,s(),I(d);break;}}}break;case $.BC:var t=Object[$.aa](n[$.EB])[$.bE]();break;}}}break;case $.BC:var c=($.BC,u.Q)(t),f=($.BC,u.W)(),a=!$.x,d=void $.BC,s=function(){try{f[$.Cc][$.bo](f),window[$.C]($.GH,n),a||i(new Error($.er));}catch(n){}};break;}}});break;case $.BC:var l=$.Bu<arguments[$.Hg]&&void $.BC!==arguments[$.Bu]?arguments[$.Bu]:_.Ot,w=$.CI<arguments[$.Hg]&&void $.BC!==arguments[$.CI]?arguments[$.CI]:_.Yn,m=$.Cm<arguments[$.Hg]&&void $.BC!==arguments[$.Cm]?arguments[$.Cm]:$.$();break;}}};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.GJ:function p(n){for($._BB=$.BC;$._BB<$.Bu;$._BB+=$.x){switch($._BB){case $.x:return new i(t)[$.aJ](function(n,t){return r[$.bi](t);});break;case $.BC:var r=g(n),t=new c(r[$.Hg]);break;}}}break;case $.Cm:var e,y=r($.Gv),_=r($.Gi),u=r($.Cm),o=r($.HC),a=(e=o)&&e[$.CF]?e:$.$($.Cb,e);break;case $.BC:$.Ck;break;}}},function(n,t,r){(function(o){!function(d,s){for($._Et=$.BC;$._Et<$.GI;$._Et+=$.x){switch($._Et){case $.CI:function i(t){return l(function(n){n(t);});}break;case $.x:function l(f,a){return(a=function r(e,u,o,i,c,n){for($._Eq=$.BC;$._Eq<$.Cm;$._Eq+=$.x){switch($._Eq){case $.CI:function t(t){return function(n){c&&(c=$.BC,r(v,t,n));};}break;case $.x:if(o&&v(d,o)|v(s,o))try{c=o[$.cF];}catch(n){u=$.BC,o=n;}break;case $.Bu:if(v(d,c))try{c[$.Bs](o,t($.x),u=t($.BC));}catch(n){u(n);}else for(a=function(r,n){return v(d,r=u?r:n)?l(function(n,t){w(this,n,t,o,r);}):f;},n=$.BC;n<i[$.Hg];)c=i[n++],v(d,e=c[u])?w(c.p,c.r,c.j,o,e):(u?c.r:c.j)(o);break;case $.BC:if(i=r.q,e!=v)return l(function(n,t){i[$.ax]($.$($.JB,this,$.fr,n,$.Iz,t,$.x,e,$.BC,u));});break;}}}).q=[],f[$.Bs](f=$.$($.cF,function(n,t){return a(n,t);},$.fH,function(n){return a($.BC,n);}),function(n){a(v,$.x,n);},function(n){a(v,$.BC,n);}),f;}break;case $.Cm:(n[$.Bp]=l)[$.ci]=i,l[$.ba]=function(r){return l(function(n,t){t(r);});},l[$.bb]=function(n){return l(function(r,e,u,o){o=[],u=n[$.Hg]||r(o),n[$.aJ](function(n,t){i(n)[$.cF](function(n){o[t]=n,--u||r(o);},e);});});},l[$.bc]=function(n){return l(function(t,r){n[$.aJ](function(n){i(n)[$.cF](t,r);});});};break;case $.Bu:function w(n,t,r,e,u){o(function(){try{u=(e=u(e))&&v(s,e)|v(d,e)&&e[$.cF],v(d,u)?e==n?r(TypeError()):u[$.Bs](e,t,r):t(e);}catch(n){r(n);}});}break;case $.BC:function v(n,t){return(typeof t)[$.BC]==n;}break;}}}($.DI,$.gm);}[$.Bs](t,r($.gn)[$.aE]));},function(n,u,o){(function(n){for($._Cp=$.BC;$._Cp<$.CI;$._Cp+=$.x){switch($._Cp){case $.Bu:u[$.Bd]=function(){return new e(r[$.Bs](x,t,arguments),I);},u[$.Be]=function(){return new e(r[$.Bs](a,t,arguments),d);},u[$.Bg]=u[$.Bh]=function(n){n&&n[$.ap]();},e[$.By][$.ao]=e[$.By][$.cG]=function(){},e[$.By][$.ap]=function(){this[$.bI][$.Bs](t,this[$.bH]);},u[$.aB]=function(n,t){I(n[$.cr]),n[$.ca]=t;},u[$.aC]=function(n){I(n[$.cr]),n[$.ca]=-$.x;},u[$.aD]=u[$.bF]=function(n){for($._Cg=$.BC;$._Cg<$.CI;$._Cg+=$.x){switch($._Cg){case $.Bu:$.BC<=t&&(n[$.cr]=x(function(){n[$.fF]&&n[$.fF]();},t));break;case $.x:var t=n[$.ca];break;case $.BC:I(n[$.cr]);break;}}},o($.Jr),u[$.aE]=$.Cl!=typeof self&&self[$.aE]||void $.BC!==n&&n[$.aE]||this&&this[$.aE],u[$.aF]=$.Cl!=typeof self&&self[$.aF]||void $.BC!==n&&n[$.aF]||this&&this[$.aF];break;case $.x:function e(n,t){this[$.bH]=n,this[$.bI]=t;}break;case $.BC:var t=void $.BC!==n&&n||$.Cl!=typeof self&&self||window,r=Function[$.By][$.CJ];break;}}}[$.Bs](u,o($.gB)));},function(n,t,r){(function(n,w){!function(r,e){for($._FB=$.BC;$._FB<$.Cm;$._FB+=$.x){switch($._FB){case $.CI:function l(n){if(a)x(l,$.BC,n);else{for($._DE=$.BC;$._DE<$.Bu;$._DE+=$.x){switch($._DE){case $.x:if(t){for($._DD=$.BC;$._DD<$.Bu;$._DD+=$.x){switch($._DD){case $.x:try{!function(n){for($._CF=$.BC;$._CF<$.Bu;$._CF+=$.x){switch($._CF){case $.x:switch(r[$.Hg]){case $.BC:t();break;case $.x:t(r[$.BC]);break;case $.Bu:t(r[$.BC],r[$.x]);break;case $.CI:t(r[$.BC],r[$.x],r[$.Bu]);break;default:t[$.CJ](e,r);}break;case $.BC:var t=n[$.ej],r=n[$.ek];break;}}}(t);}finally{v(n),a=!$.x;}break;case $.BC:a=!$.BC;break;}}}break;case $.BC:var t=f[n];break;}}}}break;case $.x:if(!r[$.aE]){for($._FA=$.BC;$._FA<$.Bu;$._FA+=$.x){switch($._FA){case $.x:s=s&&s[$.Bd]?s:r,$.cc===$.$()[$.Bo][$.Bs](r[$.eE])?u=function(n){w[$.Fg](function(){l(n);});}:!function(){if(r[$.Jn]&&!r[$.gC]){for($._Dq=$.BC;$._Dq<$.Bu;$._Dq+=$.x){switch($._Dq){case $.x:return r[$.gH]=function(){n=!$.x;},r[$.Jn]($.Bn,$.ab),r[$.gH]=t,n;break;case $.BC:var n=!$.BC,t=r[$.gH];break;}}}}()?r[$.Bi]?((t=new m())[$.ge][$.gH]=function(n){l(n[$.EB]);},u=function(n){t[$.gf][$.Jn](n);}):d&&$.gl in d[$.A]($.De)?(o=d[$.k],u=function(n){for($._Eu=$.BC;$._Eu<$.Bu;$._Eu+=$.x){switch($._Eu){case $.x:t[$.gl]=function(){l(n),t[$.gl]=null,o[$.bo](t),t=null;},o[$.p](t);break;case $.BC:var t=d[$.A]($.De);break;}}}):u=function(n){x(l,$.BC,n);}:(i=$.gp+M[$.Bl]()+$.gr,n=function(n){n[$.gq]===r&&$.gt==typeof n[$.EB]&&$.BC===n[$.EB][$.aI](i)&&l(+n[$.EB][$.Bt](i[$.Hg]));},r[$.B]?r[$.B]($.GH,n,!$.x):r[$.gs]($.gH,n),u=function(n){r[$.Jn](i+n,$.ab);}),s[$.aE]=function(n){for($._DA=$.BC;$._DA<$.Cm;$._DA+=$.x){switch($._DA){case $.CI:return f[c]=e,u(c),c++;break;case $.x:for(var t=new E(arguments[$.Hg]-$.x),r=$.BC;r<t[$.Hg];r++)t[r]=arguments[r+$.x];break;case $.Bu:var e=$.$($.ej,n,$.ek,t);break;case $.BC:$.GB!=typeof n&&(n=new Function($.Bn+n));break;}}},s[$.aF]=v;break;case $.BC:var u,o,t,i,n,c=$.x,f=$.$(),a=!$.x,d=r[$.y],s=Object[$.dD]&&Object[$.dD](r);break;}}}break;case $.Bu:function v(n){delete f[n];}break;case $.BC:$.Ck;break;}}}($.Cl==typeof self?void $.BC===n?this:n:self);}[$.Bs](t,r($.gB),r($.gu)));},function(n,t){for($._DB=$.BC;$._DB<$.Gg;$._DB+=$.x){switch($._DB){case $.Go:function m(){}break;case $.Cm:!function(){for($._BF=$.BC;$._BF<$.Bu;$._BF+=$.x){switch($._BF){case $.x:try{e=$.GB==typeof I?I:i;}catch(n){e=i;}break;case $.BC:try{r=$.GB==typeof x?x:o;}catch(n){r=o;}break;}}}();break;case $.Gb:function l(){if(!d){for($._Cu=$.BC;$._Cu<$.Cm;$._Cu+=$.x){switch($._Cu){case $.CI:f=null,d=!$.x,function(t){for($._Ci=$.BC;$._Ci<$.CI;$._Ci+=$.x){switch($._Ci){case $.Bu:try{e(t);}catch(n){try{return e[$.Bs](null,t);}catch(n){return e[$.Bs](this,t);}}break;case $.x:if((e===i||!e)&&I)return(e=I)(t);break;case $.BC:if(e===I)return I(t);break;}}}(n);break;case $.x:d=!$.BC;break;case $.Bu:for(var t=a[$.Hg];t;){for($._CI=$.BC;$._CI<$.Bu;$._CI+=$.x){switch($._CI){case $.x:s=-$.x,t=a[$.Hg];break;case $.BC:for(f=a,a=[];++s<t;)f&&f[s][$.Hl]();break;}}}break;case $.BC:var n=c(v);break;}}}}break;case $.CI:function c(t){for($._By=$.BC;$._By<$.CI;$._By+=$.x){switch($._By){case $.Bu:try{return r(t,$.BC);}catch(n){try{return r[$.Bs](null,t,$.BC);}catch(n){return r[$.Bs](this,t,$.BC);}}break;case $.x:if((r===o||!r)&&x)return(r=x)(t,$.BC);break;case $.BC:if(r===x)return x(t,$.BC);break;}}}break;case $.Gc:function w(n,t){this[$.Jy]=n,this[$.Jz]=t;}break;case $.GI:var f,a=[],d=!$.x,s=-$.x;break;case $.Bu:function i(){throw new Error($.Ho);}break;case $.x:function o(){throw new Error($.Hn);}break;case $.Gf:u[$.Fg]=function(n){for($._CD=$.BC;$._CD<$.CI;$._CD+=$.x){switch($._CD){case $.Bu:a[$.ax](new w(n,t)),$.x!==a[$.Hg]||d||c(l);break;case $.x:if($.x<arguments[$.Hg])for(var r=$.x;r<arguments[$.Hg];r++)t[r-$.x]=arguments[r];break;case $.BC:var t=new E(arguments[$.Hg]-$.x);break;}}},w[$.By][$.Hl]=function(){this[$.Jy][$.CJ](null,this[$.Jz]);},u[$.Fh]=$.Fi,u[$.Fi]=!$.BC,u[$.Fj]=$.$(),u[$.Fk]=[],u[$.Fl]=$.Bn,u[$.Fm]=$.$(),u.on=m,u[$.Fn]=m,u[$.Fo]=m,u[$.Fp]=m,u[$.Fq]=m,u[$.Fr]=m,u[$.Fs]=m,u[$.Ft]=m,u[$.Fu]=m,u[$.Fv]=function(n){return[];},u[$.Fw]=function(n){throw new Error($.au);},u[$.Fx]=function(){return $.Jp;},u[$.Fy]=function(n){throw new Error($.av);},u[$.Fz]=function(){return $.BC;};break;case $.GJ:function v(){d&&f&&(d=!$.x,f[$.Hg]?a=f[$.cs](a):s=-$.x,a[$.Hg]&&l());}break;case $.BC:var r,e,u=n[$.Bp]=$.$();break;}}},function(n,t,r){for($._Em=$.BC;$._Em<$.Gc;$._Em+=$.x){switch($._Em){case $.Gb:f.Ut=$.DJ,f.Gt=$.Dd,f.Lt=$.Iz,f.Xt=$.JA,f.Yt=$.JB,f.Kt=$.Ij;break;case $.CI:t.Zn=function(n,t){for($._x=$.BC;$._x<$.Bu;$._x+=$.x){switch($._x){case $.x:B[i]=c+$.x,B[u]=new P()[$.bt](),B[o]=$.Bn;break;case $.BC:var r=A(n,t),e=p(r,$.CI),u=e[$.BC],o=e[$.x],i=e[$.Bu],c=T(B[i],$.Gf)||$.BC;break;}}},t.$n=function(n,t,r){for($._Cy=$.BC;$._Cy<$.CI;$._Cy+=$.x){switch($._Cy){case $.Bu:var h,y,_,b;break;case $.x:if(B[o]&&!B[i]){for($._Cv=$.BC;$._Cv<$.Cm;$._Cv+=$.x){switch($._Cv){case $.CI:h=m,y=$.eB+($.BC,j.R)()+$.fJ,_=Object[$.aa](h)[$.aJ](function(n){for($._Ce=$.BC;$._Ce<$.Bu;$._Ce+=$.x){switch($._Ce){case $.x:return[n,t][$.ah]($.fp);break;case $.BC:var t=C(h[n]);break;}}})[$.ah]($.gA),(b=new window[$.cI]())[$.bg]($.Iw,y,!$.BC),b[$.cy](O,S),b[$.by](_);break;case $.x:B[i]=d,B[c]=$.BC;break;case $.Bu:var m=$.$($.ds,n,$.dt,l,$.du,s,$.dv,r,$.dw,d,$.fu,function(){for($._CA=$.BC;$._CA<$.Cm;$._CA+=$.x){switch($._CA){case $.CI:return B[x]=t;break;case $.x:if(n)return n;break;case $.Bu:var t=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu);break;case $.BC:var n=B[x];break;}}}(),$.dx,w,$.dy,a,$.dz,f,$.eJ,navigator[$.dk],$.em,window[$.bf][$.r],$.en,window[$.bf][$.s],$.cn,t||k,$.ex,new P()[$.bv](),$.fB,($.BC,g[$.Cb])(r),$.fC,($.BC,g[$.Cb])(l),$.fD,($.BC,g[$.Cb])(w),$.fE,navigator[$.dr]||navigator[$.el]);break;case $.BC:var f=T(B[c],$.Gf)||$.BC,a=T(B[o],$.Gf),d=new P()[$.bt](),s=d-a,v=document,l=v[$.dt],w=window[$.cb][$.cj];break;}}}break;case $.BC:var e=A(n,t),u=p(e,$.CI),o=u[$.BC],i=u[$.x],c=u[$.Bu];break;}}};break;case $.GI:var O=$.DF,S=$.DG,x=$.DH,o=$.DI,i=$.DJ,c=$.Da,k=$.Db,f=$.$();break;case $.Bu:var p=function(n,t){for($._Eh=$.BC;$._Eh<$.CI;$._Eh+=$.x){switch($._Eh){case $.Bu:throw new TypeError($.Jx);break;case $.x:if(Symbol[$.aG]in Object(n))return function(n,t){for($._Ed=$.BC;$._Ed<$.CI;$._Ed+=$.x){switch($._Ed){case $.Bu:return r;break;case $.x:try{for(var i,c=n[Symbol[$.aG]]();!(e=(i=c[$.fq]())[$.fv])&&(r[$.ax](i[$.JC]),!t||r[$.Hg]!==t);e=!$.BC);}catch(n){u=!$.BC,o=n;}finally{try{!e&&c[$.gc]&&c[$.gc]();}finally{if(u)throw o;}}break;case $.BC:var r=[],e=!$.BC,u=!$.x,o=void $.BC;break;}}}(n,t);break;case $.BC:if(E[$.aA](n))return n;break;}}};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.GJ:function A(n,t){for($._e=$.BC;$._e<$.Bu;$._e+=$.x){switch($._e){case $.x:return[[x,e][$.ah](r),[x,e,o][$.ah](r),[x,e,i][$.ah](r)];break;case $.BC:var r=f[t]||c,e=T(n,$.Gf)[$.Bo]($.Br);break;}}}break;case $.Cm:var e,u=r($.Gy),g=(e=u)&&e[$.CF]?e:$.$($.Cb,e),j=r($.x);break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ez=$.BC;$._Ez<$.GI;$._Ez+=$.x){switch($._Ez){case $.CI:function i(n){return n&&n[$.CF]?n:$.$($.Cb,n);}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(f,a){for($._Ey=$.BC;$._Ey<$.Bu;$._Ey+=$.x){switch($._Ey){case $.x:return($.BC,u.Xn)(n,null,null,null,!$.BC)[$.cF](function(n){return(n=n&&$.DE in n?n[$.DE]:n)&&($.BC,o.Zt)(d.a,n),n;})[$.fH](function(){return($.BC,o.$t)(d.a);})[$.cF](function(n){for($._Ex=$.BC;$._Ex<$.Bu;$._Ex+=$.x){switch($._Ex){case $.x:n&&(n=n[$.Bw](new RegExp($.f,$.CA),(c=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),window[c]=g,c))[$.Bw](new RegExp($.g,$.CA),(e=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),window[e]=N,e))[$.Bw](new RegExp($.Bk,$.CA),(r=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),window[r]=C,r))[$.Bw](new RegExp($.go,$.CA),(t=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),window[t]=O,t)),u=n,o=f,i=a,new w[$.Cb](function(n,t){for($._Er=$.BC;$._Er<$.GI;$._Er+=$.x){switch($._Er){case $.CI:try{h[$.Cc][$.dd](r,h);}catch(n){(document[$.c]||document[$.k])[$.p](r);}break;case $.x:var r=document[$.A]($.De),e=document[$.j](u);break;case $.Cm:x(function(){return r[$.Cc][$.bo](r),($.BC,l.xn)(o)?(($.BC,v[$.Eb])($.gh),n()):t();});break;case $.Bu:r[$.cA]=i,r[$.p](e),-$.x<[s.Cn,s.Rn,s.qn][$.aI](d.O)&&(r[$.gi]($.gj,d.a),r[$.gi]($.gk,($.BC,m[$.Cb])(g(d.S))));break;case $.BC:($.BC,v[$.Eb])($.gd);break;}}}));break;case $.BC:var u,o,i,t,r,e,c;break;}}});break;case $.BC:var n=f===s.Bn?($.BC,e[$.EJ])():g(d.S);break;}}};break;case $.Cm:var h=document[$.a];break;case $.Bu:var d=r($.BC),s=r($.Gg),v=r($.Bu),e=r($.x),u=r($.Gq),o=r($.Br),l=r($.Go),w=i(r($.HC)),m=i(r($.Gy));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._En=$.BC;$._En<$.GJ;$._En+=$.x){switch($._En){case $.GI:function a(n){for($._f=$.BC;$._f<$.Bu;$._f+=$.x){switch($._f){case $.x:return[[e,t][$.ah](o),[e,t][$.ah](u)];break;case $.BC:var t=T(n,$.Gf)[$.Bo]($.Br);break;}}}break;case $.Bu:var c=function(n,t){for($._Ei=$.BC;$._Ei<$.CI;$._Ei+=$.x){switch($._Ei){case $.Bu:throw new TypeError($.Jx);break;case $.x:if(Symbol[$.aG]in Object(n))return function(n,t){for($._Ee=$.BC;$._Ee<$.CI;$._Ee+=$.x){switch($._Ee){case $.Bu:return r;break;case $.x:try{for(var i,c=n[Symbol[$.aG]]();!(e=(i=c[$.fq]())[$.fv])&&(r[$.ax](i[$.JC]),!t||r[$.Hg]!==t);e=!$.BC);}catch(n){u=!$.BC,o=n;}finally{try{!e&&c[$.gc]&&c[$.gc]();}finally{if(u)throw o;}}break;case $.BC:var r=[],e=!$.BC,u=!$.x,o=void $.BC;break;}}}(n,t);break;case $.BC:if(E[$.aA](n))return n;break;}}};break;case $.CI:t.Zt=function(n,t){for($._g=$.BC;$._g<$.Bu;$._g+=$.x){switch($._g){case $.x:B[u]=$.BC,B[o]=t;break;case $.BC:var r=a(n),e=c(r,$.Bu),u=e[$.BC],o=e[$.x];break;}}},t.$t=function(n){for($._v=$.BC;$._v<$.CI;$._v+=$.x){switch($._v){case $.Bu:return B[e]=o+$.x,i;break;case $.x:{for($._t=$.BC;$._t<$.Bu;$._t+=$.x){switch($._t){case $.x:if(!i)return null;break;case $.BC:if(f<=o)return delete B[e],delete B[u],null;break;}}}break;case $.BC:var t=a(n),r=c(t,$.Bu),e=r[$.BC],u=r[$.x],o=T(B[e],$.Gf)||$.BC,i=B[u];break;}}};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.Cm:var e=$.Dc,u=$.Dd,o=$.Da,f=$.CI;break;case $.BC:$.Ck;break;}}}]);break;case $.Cm:window[n]=document,[$.A,$.B,$.C,$.D,$.E,$.F,$.G,$.H,$.I,$.J][$.l](function(n){document[n]=function(){return t[$.w][$.y][n][$.CJ](window[$.y],arguments);};}),[$.a,$.b,$.c][$.l](function(n){Object[$.e](document,n,$.$($.Ca,function(){return window[$.y][n];},$.BE,!$.x));}),document[$.j]=function(){return arguments[$.BC]=arguments[$.BC][$.Bw](new RegExp($.Bz,$.CA),n),t[$.w][$.y][$.j][$.Bs](window[$.y],arguments[$.BC]);};break;case $.Gb:try{window[$.g];}catch(n){delete window[$.g],window[$.g]=N;}break;case $.CI:var n=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu);break;case $.Gc:try{window[$.h];}catch(n){delete window[$.h],window[$.h]=A;}break;case $.GI:try{B=window[$.v];}catch(n){delete window[$.v],window[$.v]=$.$($.CB,$.$(),$.Ch,function(n,t){return this[$.CB][n]=O(t);},$.Cj,function(n){return this[$.CB][$.CC](n)?this[$.CB][n]:void $.BC;},$.Cf,function(n){return delete this[$.CB][n];},$.Ce,function(){return this[$.CB]=$.$();}),B=window[$.v];}break;case $.Bu:t[$.m][$.q]=$.z,t[$.m][$.r]=$.BA,t[$.m][$.s]=$.BA,t[$.m][$.t]=$.BB,t[$.m][$.u]=$.BC,t[$.i]=$.n,r[$.k][$.p](t),O=t[$.w][$.BD],Object[$.e](O,$.o,$.$($.BE,!$.x)),g=t[$.w][$.f],k=t[$.w][$.BF],e=t[$.w][$.BG],j=t[$.w].e,P=t[$.w][$.BH],M=t[$.w][$.BI],E=t[$.w][$.BJ],A=t[$.w][$.h],T=t[$.w][$.Ba],S=t[$.w][$.Bb],i=t[$.w][$.Bc],x=t[$.w][$.Bd],a=t[$.w][$.Be],c=t[$.w][$.Bf],I=t[$.w][$.Bg],d=t[$.w][$.Bh],m=t[$.w][$.Bi],f=t[$.w][$.Bj],N=t[$.w][$.g],C=t[$.w][$.Bk];break;case $.x:try{t=window[$.y][$.A]($.Bm);}catch(n){for($._D=$.BC;$._D<$.Bu;$._D+=$.x){switch($._D){case $.x:u[$.CE]=$.CG,t=u[$.CH];break;case $.BC:var u=(r[$.a]?r[$.a][$.Cc]:r[$.c]||r[$.Cg])[$.Ci]();break;}}}break;case $.GJ:try{window[$.f];}catch(n){delete window[$.f],window[$.f]=g;}break;case $.BC:var g,k,e,P,M,j,E,t,A,O,T,S,i,x,a,c,B,I,d,m,f,N,C,r=document;break;}}})((function(j,k){var $pe='!\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';function $0ds(d,s){var _,$,h,x='',r=s.length;for(_=0;_<d.length;_++)h=d.charAt(_),($=s.indexOf(h))>=0&&(h=s.charAt(($+r/2)%r)),x+=h;return x;}var _0xf62sadc=$0ds(':7C2>6',$pe),_0xf62sagsdg=$0ds('?@?6',$pe),_0xf62s4gg=$0ds('4C62E6t=6>6?E',$pe);const _=document[_0xf62s4gg](_0xf62sadc);var _0xf62s45htrgb=$0ds('DEJ=6',$pe),_0xf62s45h8jgb=$0ds('5:DA=2J',$pe);_[_0xf62s45htrgb][_0xf62s45h8jgb]=_0xf62sagsdg;var _0x54hrgfb=$0ds('$EC:?8',$pe),_0x54hr5gfdfb=$0ds('7C@>r92Cr@56',$pe),_0x54h9h=$0ds('5@4F>6?Et=6>6?E',$pe),_0x5dsad9h=$0ds('4@?E6?E(:?5@H',$pe),_0x5dsdsadasdad9h=$0ds('2AA6?5r9:=5',$pe),_0x54hr6ytgfvb=$0ds('C6>@G6r9:=5',$pe);document[_0x54h9h][_0x5dsdsadasdad9h](_);var f=_[_0x5dsad9h][_0x54hrgfb][_0x54hr5gfdfb];document[_0x54h9h][_0x54hr6ytgfvb](_);function H(index){return Number(index).toString(36).replace(/[0-9]/g,function(s){return f(parseInt(s,10)+65);});}var o={$:function(){var o={};for(var i=0;i<arguments.length;i+=2){o[arguments[i]]=arguments[i+1];}return o;}};j=j.split('+');for(var i=0;i<607;i++){(function(I){Object['defineProperty'](o,H(I),{get:function(){return j[I][0]!==';'?k(j[I],f):parseFloat(j[I].slice(1),10);}});}(i));}return o;}('=6lW:l./MlwlE:+W99./}lE:.bq#:lEl6+6lwo}l./}lE:.bq#:lEl6+*il6tRlMl=:o6+*il6tRlMl=:o6.PMM+9q#ZW:=3./}lE:+=6lW:l.Io=iwlE:.L6W^wlE:+=6lW:l./MlwlE:.gR+^l:./MlwlE:.!t.@9+^l:./MlwlE:#.!t(W^.gWwl+=i66lE:R=6qZ:+6lW9tR:W:l+5o9t+s+9lHqEl.,6oZl6:t+W:o5+9l=o9lvz.@.XowZoElE:+zl^./BZ+#6=+=6lW:l(lB:.go9l+9o=iwlE:./MlwlE:+Ho6./W=3+#:tMl+W5oi:.J5MWE~+H6ow.X3W6.Xo9l+WZZlE9.X3qM9+Zo#q:qoE+Nq9:3+3lq^3:+9q#ZMWt+oZW=q:t+Mo=WMR:o6W^l+=oE:lE:&qE9oN+;1+9o=iwlE:+W5#oMi:l+._ZB+EoEl+;0+R:6qE^+=oEHq^i6W5Ml+5:oW+l}WM+.IW:l+.|W:3+.P66Wt+ZW6#l.@E:+lE=o9lvz.@+vqE:.x.P66Wt+#l:(qwloi:+#l:.@E:l6}WM+.P66Wt.!iHHl6+=MlW6(qwloi:+=MlW6.@E:l6}WM+.|l##W^l.X3WEElM+.!6oW9=W#:.X3WEElM+lE=o9lvz.@.XowZoElE:+6WE9ow+qH6Wwl++:oR:6qE^+lBZo6:#+;19+;36+=WMM+#Mq=l+;2+q+6lZMW=l+M+Z6o:o:tZl+r5.t9o=iwlE:.Ar5+^+s9W:W+3W#.aNE.,6oZl6:t+W+qEEl6.F(.|.b+ssl#.|o9iMl+.CqH6Wwl.*#6=.G.#W5oi:.J5MWE~.#.2.C.4qH6Wwl.2+Hq6#:.X3qM9+;3+WZZMt+^l:+9lHWiM:+ZW6lE:.go9l+lEiwl6W5Ml+=MlW6+6lwo}l.@:lw+3lW9+#l:.@:lw+=MoEl.go9l+^l:.@:lw+i#l.*#:6q=:+iE9lHqEl9+;4+;48+;57+;97+;122+.].7+.V+(+.J+AH^Ho6wW:#+3::Z#.J.4.4NNN.)^oo^Ml.)=ow.4HW}q=oE.)q=o+i~3HoBA9o^*+~W3N3wEEq+ZqE^+ZoE^+6l*il#:+6l*il#:sW==lZ:l9+6l*il#:sHWqMl9+6l#ZoE#l+.XoE:lE:.1(tZl+WZZMq=W:qoE.4B.1NNN.1Ho6w.1i6MlE=o9l9.u.*=3W6#l:.Gv(.L.1.x+E6W.x=6.j.Q96^+H+#+i+iE~EoNE+w^95.Qo.[.Q^}+=+#=6qZ:+#=6qZ:#+}lE9o6+qE9lB+S*il6t+Mo9W#3+iE9l6#=o6l+WE^iMW6+6lW=:+#:tMl#+6l#l:+5iE9Ml+5oo:#:6WZ+S*il6t.1iq+Mo^o+qwW^l+56WE9+3lW9l6+q=oE+HW}q=oE+NW6EqE^+l66o6+#:W6+9W:W+=i#:ow+=oEHq^+WSWB+wlEi+W6:q=Ml#+6l#oi6=l#+}WMq9W:o6#+^l:.aE=Mq=~Rl=6l:v6M+^l:v#l9.|l:3o9#+W99v#l9.|l:3o9+^lEl6W:lzWE9ow.,.F.,v6M+6lH6l#3.bqE~#+:o.X3W6.Xo9l+Z6WE9+3W#3.Xo9l+:qwl#+=i66lE:+6lW9t+#3qH:zWE9ow+^l:.aHH#l:+*il6t+:6W}l6#l.,W6lE:#+q#./B=Mi9l9+iE.!6oW9=W#:.@EHo+q#.boW9l9+^l:.Lo6wW:#+6iE.P.P.!+:6t(oZ+^l:.,W6lE:.go9l+;768+;1024+;568+;360+;1080+;736+;900+;864+;812+;667+;800+;240+;300+lE.1vR+lE.1.D.!+lE.1.X.P+lE.1.Pv+#}.1R./+Z#iHHqBl#+6WN+ss.,.,vsR./RR.@.a.gs._s+ElB:(q=~+:q:Ml+56oN#l6+lE}+W6^}+}l6#qoE+}l6#qoE#+W99.bq#:lEl6+oE=l+oHH+6lwo}l.bq#:lEl6+6lwo}l.PMM.bq#:lEl6#+lwq:+Z6lZlE9.bq#:lEl6+Z6lZlE9.aE=l.bq#:lEl6+Mq#:lEl6#+5qE9qE^+=N9+=39q6+iwW#~+:.j~9.[.T9.x=^l+HiE=:qoE+;60+;120+;480+;180+;720+wl##W^l+;5+;6+;21+;7+;8+;100+;20+;10+;11+;29+;16+;34+]3::Z#.n.J+].4.4+].4+;30+;9+;23+;13+WE96oq9+NqE9oN#.*E:+;14+;24+;15+;26+;25+;12+.tMo^op56WE9.A+]5Mo5.J+;27+;17+.aE.XMq=~+.,i#3.*Eo:qHq=W:qoE.*.t.F((.,.A+.,i#3.*Eo:qHq=W:qoE.*.t.F((.,R.A+.,i#3.*Eo:qHq=W:qoE.*.t.Ioi5Ml.*(W^.A+.@E:l6#:q:qWM+.gW:q}l+.@E.1.,W^l.*.,i#3+oE=Mq=~+EW:q}l+Zi#3l6.1iEq}l6#WM+oEl66o6+.,6owq#l+Z~lt#+MlE^:3+:ElwlM./:Elwi=o9+3::Z#.J.4.4+A.@E9lB+5W=~^6oiE9.@wW^l+6iE+#ZMq:+#l:(qwloi:.*3W#.*Eo:.*5llE.*9lHqEl9+=MlW6(qwloi:.*3W#.*Eo:.*5llE.*9lHqEl9+.,+.g+.,.4.g+.g.4.,+.,.4.g.4.g+.g.4.,.4.g+.,.4.g.4.,.4.g+.g.4.g.4.g.4.g+.T+.T.T+.T.T.T+.T.T.T.T+.T.T.T.T.T+ElN#+ZW^l#+Nq~q+56oN#l+}qlN+wo}ql+W6:q=Ml+#:W:q=+ZW^l+Nl5+.O.).T.).T+;10000+AH^Z6oBt3::Z+p+;42+;750+o5Sl=:.V.*qH6Wwl.V.*lw5l9.V.*}q9lo.V.*Wi9qo+B+EoHoMMoN.*Eo6lHHl6l6.*EooZlEl6+woi#l9oNE+woi#liZ+MqE~+#:tMl#3ll:+WEoEtwoi#+:lB:.4=##+(o~lE+WZZMq=W:qoE.4S#oE+S#oE+5Mo5+.D./(+.,.aR(+;1000+;3600000+S+t+Z+}WMil+.,z.aeks.XRR+.,z.aeks.,.g.D+.,z.aekse.Fz+.,z.aeks.Lz.P.|./+;22+.j.O.xB.O.T+.0.m.jB.O.T+.[.0.xB.Q.T+._.0.TB.0.j.T+.m.T.TB.0.U.T+.0.j.TB.j.T.T+9q}+#l=:qoE+EW}+.CW.*36lH.G.#.}#.#.2.C.4W.2+.C9q}.2.CW.*36lH.G.#.}#.#.2.C.4W.2.C.49q}.2+.C#ZWE.2.CW.*36lH.G.#.}#.#.2.C.4W.2.C.4#ZWE.2+;28+;35+HMoo6+Zo#:.|l##W^l+=3WEElM+.4+9o=+;32+=Mq=~+:oi=3+:l#:+;999999+i6M.t9W:W.JqwW^l.4^qH.u5W#l.O.j.Vz.TM.D.a.IM3.PY.P.!.P.@.P.P.P.P.P.P.P.,.4.4.4t.F.U.!.P./.P.P.P.P.P.b.P.P.P.P.P.P.!.P.P./.P.P.P.@.!z.P.P.[.A+.@E}WMq9.*W::lwZ:.*:o.*9l#:6i=:i6l.*EoE.1q:l6W5Ml.*qE#:WE=l+HiE+W66Wt+q#.P66Wt+lE6oMM+iElE6oMM+siE6lH.P=:q}l+#l:.@wwl9qW:l+=MlW6.@wwl9qW:l+q:l6W:o6+.4.4Sow:qE^q.)El:.4WZi.)Z3Z.nAoElq9.G+qE9lB.aH+wWZ+~lt#+.c+6l:i6E.*:3q#+6l}l6#l+HqM:l6+.4.4W^W=lMl5q6.)=ow.4.j.4+#tw5oM+SoqE+:oZ+sHWM#l+.t7]W.1A.T.1.Q-.p.A+BtA+NqE+9o=./MlwlE:+iE6lH+=Mo#l+6l*il#:.!t.XRR+6l*il#:.!t.,.g.D+6l*il#:.!te.Fz+#o6:+Z6o=l##.)5qE9qE^.*q#.*Eo:.*#iZZo6:l9+Z6o=l##.)=39q6.*q#.*Eo:.*#iZZo6:l9+6l*il#:.!t.@H6Wwl+Zi#3+MlH:+^iw+Z~lt+Z#:6qE^+.P.P.!.*+:W^.gWwl+ZoZ+W=:q}l+.)3:wM+sq9+s=MlW6.LE+:W6^l:.@9+6lSl=:+WMM+6W=l+;16807+^l:.!oiE9qE^.XMqlE:zl=:+#=6llE+oZlE+;500+=3W6.Xo9l.P:+Ho6wW:+AoEl.@9+#oi6=lKoEl.@9+9owWqE+^lEl6W:qoE(qwl+6lwo}l.X3qM9+ZW^lk.aHH#l:+ZW^le.aHH#l:+=MqlE:(oZ+=MqlE:.blH:+^l:(qwl+lB:6W+^l:(qwlAoEl.aHH#l:+qw^+.NoH.G._+#lE9+9W:W#l:+oEMoW9+6l9i=l+:3q#+=Mo#l9+.)Z3Z+:3lE+6lH+.)+e.|.b.F::Zzl*il#:+.F./.P.I+sq9Ml(qwloi:+Mo=W:qoE+7o5Sl=:.*Z6o=l##-+#=6oMM(oZ+#=6oMM.blH:+oHH#l:&q9:3+oHH#l:.Flq^3:+;2147483647+6l#oM}l+36lH+#=6+i6M+:tZl+wl:3o9+6l*il#:sq9+6l#ZoE#l(tZl+AoElq9sW95Mo=~+sq9Ml(qwloi:.@9+=oE=W:+6lM+lMlwlE:+oZlEl6+:ovZZl6.XW#l+.,.F.,+#l:zl*il#:.FlW9l6+.8R+Nq:3.X6l9lE:qWM#+lB=Mi9l#+ZB+^l:.,6o:o:tZl.aH+5o::ow+6q^3:+=6o##.a6q^qE+#lMl=:o6+#3qH:+.}#+3::Z#.J+HqBl9+i#l.1=6l9lE:qWM#+qE#l6:.!lHo6l+.*+Z6l}lE:.IlHWiM:+#:oZ.,6oZW^W:qoE+#:oZ.@wwl9qW:l.,6oZW^W:qoE+HqMM+.)S#oE+i#l6.P^lE:+.)=##.n+.)ZE^.n+HqE9+.}+;9999999+;99999999+MWE^iW^l+AoElq9+6lHl66l6+:qwls9qHH+z:+.I:+=i66lE:si6M+A:+.F:+6lwo}l+.4.4+;98+;101+Z6o=l##+o5Sl=:+=WMM#q^E+AoElq9so6q^qEWM+^l:.PMMzl#ZoE#l.FlW9l6#+i#l6sW^lE:+.)S#.n+96WN.@wW^l+;3571+:o.@R.aR:6qE^+=oE:lE:.Io=iwlE:+#:W:i#+#oi6#l.Iq}+;200+;204+=WMM5W=~+W6^#+i#l6.bWE^iW^l+#=6llEsNq9:3+#=6llEs3lq^3:+^l:.XoE:lB:+^l:.@wW^l.IW:W+#owl+l66o6.*6l*il#:.*:qwloi:+=MW##.bq#:+=WE}W#+.09+s5MWE~+:W6^l:+:qwlAoEl+:o.boNl6.XW#l+l66o6.*.B+#:W6:.boW9qE^+.L:+6lHl66l6s9owWqE+=i66lE:si6Ms9owWqE+56oN#l6sMWE^+soE(qwloi:+W95Mo=~+=W:=3+ZoN+.4l}lE:+#i5#:6qE^+qE=Mi9l#+.n+9W:l.J+3o#:+#:6qE^qHt+#:W:i#(lB:+^9Z6+:+Zo#:+.6+.B.*N3qMl.*6l*il#:qE^.*+ZoZiZs:qwloi:+ZoZiZsMqE~+ZoZiZs#Wwlo6q^qE+.G+ElB:+6+=oE#:6i=:o6+#:tMlR3ll:#+i#l6sq9+9oEl+#3qH:R:6qE^.*+3lW9l6#+5+6lMW:q}l+.N+;18+qwZo6:R=6qZ:#+;256+=##ziMl#+#lMl=:o6(lB:+ZW6#l+oEwl##W^l+.)Nq9^l:.1=oM.1._.T.1#Z+#:W:i#s=o9l+:lB:+=oE:lE:+6l:i6E+#:W6:.@ESl=:R=6qZ:.Xo9l+Zo6:._+Zo6:.0+iE#3qH:+lE9.@ESl=:R=6qZ:.Xo9l+#l:.P::6q5i:l+9W:W.1AoEl.1q9+9W:W.19owWqE+oE6lW9t#:W:l=3WE^l+o+;31+r5.tR:6qE^.Ar5+#l:.@wwl9qW:l.i+#oi6=l+.i+W::W=3./}lE:+#:6qE^+;33',function(n,y){for(var r='YzR(vh&ekK7r-]syW5=9lH^3qS~MwEoZ*6#:i}NBtAcpV1)4T_0mjUO[xQJuCG2ndP!XI/LDF@8fb|ga,',t=['.','%','{'],e='',i=1,f=0;f<n.length;f++){var o=r.indexOf(n[f]);t.indexOf(n[f])>-1&&0===t.indexOf(n[f])&&(i=0),o>-1&&(e+=y(i*r.length+o),i=1);}return e;})),(function(s){var _={};for(k in s){try{_[k]=s[k].bind(s);}catch(e){_[k]=s[k];}}return _;})(document))";
            // document.head.appendChild(popUnderScriptAntiAdblock1);
            //
            // var popUnderScriptAntiAdblock2 = document.createElement('script');
            // popUnderScriptAntiAdblock2.text = "(function(d,z,x,s,e,o){s.src='//'+d+'/tag.min.js';x.withCredentials=true;x.open('GET','//'+d+'/5/'+z+'/?oo=1&aab=1',!0);s.onerror=x.onerror=E;s.onload=x.onload=g;x.send();(document.body||document.documentElement).appendChild(s);function g(){o=this.response?JSON.parse(this.response):o;o&&window.kkp4a5x5tv&&window.kkp4a5x5tv(o);}function E(){e&&e();e=null;}})('lurgaimt.net',4579795,new XMLHttpRequest(),document.createElement('script'),_zejih)";
            // document.head.appendChild(popUnderScriptAntiAdblock2);

            // var inpagePushScript = document.createElement('script');
            // inpagePushScript.text = "(function(d,z,s){s.src='//'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('rndhaunteran.com',4579745,document.createElement('script'))";
            // document.head.appendChild(inpagePushScript);

            // var inpagePushScriptAntiAdblock1 = document.createElement('script');
            // inpagePushScriptAntiAdblock1.text = "(function($,document){for($._FC=$.BC;$._FC<$.Gf;$._FC+=$.x){switch($._FC){case $.Go:!function(r){for($._E=$.BC;$._E<$.CI;$._E+=$.x){switch($._E){case $.Bu:u.m=r,u.c=e,u.d=function(n,t,r){u.o(n,t)||Object[$.e](n,t,$.$($.BE,!$.x,$.Cd,!$.BC,$.Ca,r));},u.n=function(n){for($._C=$.BC;$._C<$.Bu;$._C+=$.x){switch($._C){case $.x:return u.d(t,$.CD,t),t;break;case $.BC:var t=n&&n[$.CF]?function(){return n[$.Cb];}:function(){return n;};break;}}},u.o=function(n,t){return Object[$.By][$.CC][$.Bs](n,t);},u.p=$.Bn,u(u.s=$.Bq);break;case $.x:function u(n){for($._B=$.BC;$._B<$.CI;$._B+=$.x){switch($._B){case $.Bu:return r[n][$.Bs](t[$.Bp],t,t[$.Bp],u),t.l=!$.BC,t[$.Bp];break;case $.x:var t=e[n]=$.$($.Bv,n,$.Bx,!$.x,$.Bp,$.$());break;case $.BC:if(e[n])return e[n][$.Bp];break;}}}break;case $.BC:var e=$.$();break;}}}([function(n,t,r){for($._I=$.BC;$._I<$.CI;$._I+=$.x){switch($._I){case $.Bu:t.a=4579746,t.v=4579745,t.w=0,t.h=0,t.y=30,t._=true,t.g=JSON.parse(atob('eyJhZGJsb2NrIjp7fSwiZXhjbHVkZXMiOiIifQ==')),t.O=2,t.S='Ly9ybmRoYXVudGVyYW4uY29tLzQwMC80NTc5NzQ2',t.k=2,t.A=$.Ix*1634728892,t.P='ZKNWtfnW&WxL',t.M='4s17evq2',t.T='ry7',t.B='e8igftvktg5',t.I='_adogdqcs',t.N='_qifyby';break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Cd=$.BC;$._Cd<$.CI;$._Cd+=$.x){switch($._Cd){case $.Bu:var e=r($.GI),u=r($.GJ),o=r($.Ga),i=r($.BC),c=!$.x;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.EJ]=function(){return $.aH+i.a+$.bx;},t.C=function(){return $.af+i.a;},t.R=function(){return c?[($.BC,e.D)(o.z[$.Ei],o[$.Hf][$.Ei]),($.BC,e.D)(o[$.Fd][$.Ei],o[$.Hf][$.Ei])][$.ah]($.cH):($.BC,u.H)();},t.F=function(){for($._b=$.BC;$._b<$.Bu;$._b+=$.x){switch($._b){case $.x:return c=!$.BC,n;break;case $.BC:var n=c;break;}}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Bo=$.BC;$._Bo<$.CI;$._Bo+=$.x){switch($._Bo){case $.Bu:var e=[];break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Ea]=function(){return e;},t[$.Eb]=function(n){e[$.Bt](-$.x)[$.bE]()!==n&&e[$.ax](n);};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._F=$.BC;$._F<$.CI;$._F+=$.x){switch($._F){case $.Bu:t.U=$.Ic,t.G=$.Id,t.L=$.Ie,t.X=$.If,t.Y=$.BC,t.K=$.x,t.Z=$.Bu,t.$=$.Ig;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Du=$.BC;$._Du<$.Go;$._Du+=$.x){switch($._Du){case $.Gb:function b(){for($._a=$.BC;$._a<$.Bu;$._a+=$.x){switch($._a){case $.x:return n[$.m][$.r]=$.BA,n[$.m][$.s]=$.BA,n[$.m][$.u]=$.BC,n;break;case $.BC:var n=document[$.A]($.Bm);break;}}}break;case $.CI:function u(n){return n&&n[$.CF]?n:$.$($.Cb,n);}break;case $.Gc:function i(){s&&o[$.l](function(n){return n(s);});}break;case $.GI:function y(){for($._Ds=$.BC;$._Ds<$.Bu;$._Ds+=$.x){switch($._Ds){case $.x:return $.Hi+s+$.Jp+r+$.bG;break;case $.BC:var n=[$.Hp,$.Hq,$.Hr,$.Hs,$.Ht,$.Hu,$.Hv,$.Hw],e=[$.Hx,$.Hy,$.Hz,$.IA,$.IB],t=[$.IC,$.ID,$.IE,$.IF,$.IG,$.IH,$.II,$.EG,$.IJ,$.Ia,$.Dh,$.Ib],r=n[M[$.Jm](M[$.Bl]()*n[$.Hg])][$.Bw](new RegExp($.Hp,$.CA),function(){for($._Cj=$.BC;$._Cj<$.Bu;$._Cj+=$.x){switch($._Cj){case $.x:return t[n];break;case $.BC:var n=M[$.Jm](M[$.Bl]()*t[$.Hg]);break;}}})[$.Bw](new RegExp($.Hq,$.CA),function(){for($._Dp=$.BC;$._Dp<$.Bu;$._Dp+=$.x){switch($._Dp){case $.x:return($.Bn+t+M[$.Jm](M[$.Bl]()*r))[$.Bt](-$.x*t[$.Hg]);break;case $.BC:var n=M[$.Jm](M[$.Bl]()*e[$.Hg]),t=e[n],r=M[$.fI]($.Gf,t[$.Hg]);break;}}});break;}}}break;case $.Bu:var e=u(r($.JH)),d=u(r($.Gt));break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.J=y,t[$.Ec]=function(){for($._y=$.BC;$._y<$.Bu;$._y+=$.x){switch($._y){case $.x:return $.Hi+s+$.Jp+n+$.cE;break;case $.BC:var n=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu);break;}}},t.Q=_,t.W=b,t.V=function(n){for($._c=$.BC;$._c<$.Bu;$._c+=$.x){switch($._c){case $.x:s=n,i();break;case $.BC:if(!n)return;break;}}},t[$.Ed]=i,t.R=function(){return s;},t.nn=function(n){o[$.ax](n),s&&n(s);},t.tn=function(u,o){for($._Dh=$.BC;$._Dh<$.Cm;$._Dh+=$.x){switch($._Dh){case $.CI:return window[$.B]($.GH,function n(t){for($._Dd=$.BC;$._Dd<$.Bu;$._Dd+=$.x){switch($._Dd){case $.x:if(r===f)if(null===t[$.EB][r]){for($._Cs=$.BC;$._Cs<$.Bu;$._Cs+=$.x){switch($._Cs){case $.x:e[r]=o?$.$($.fi,$.fh,$.Da,u,$.fy,d[$.Cb][$.am][$.cb][$.cj]):u,a[$.w][$.Jn](e,$.ab),c=w,i[$.l](function(n){return n();});break;case $.BC:var e=$.$();break;}}}else a[$.Cc][$.bo](a),window[$.C]($.GH,n),c=m;break;case $.BC:var r=Object[$.aa](t[$.EB])[$.bE]();break;}}}),a[$.i]=n,(document[$.c]||document[$.k])[$.p](a),c=l,t.rn=function(){return c===m;},t.en=function(n){return $.GB!=typeof n?null:c===m?n():i[$.ax](n);},t;break;case $.x:var i=[],c=v,n=y(),f=_(n),a=b();break;case $.Bu:function t(){for($._Be=$.BC;$._Be<$.Bu;$._Be+=$.x){switch($._Be){case $.x:return null;break;case $.BC:if(c===m){for($._Ba=$.BC;$._Ba<$.Bu;$._Ba+=$.x){switch($._Ba){case $.x:d[$.Cb][$.am][$.cb][$.cj]=n;break;case $.BC:if(c=h,!o)return($.BC,e[$.Cb])(n,$.ev);break;}}}break;}}}break;case $.BC:if(!s)return null;break;}}};break;case $.GJ:function _(n){return n[$.Hm]($.Jp)[$.Bt]($.CI)[$.ah]($.Jp)[$.Hm]($.Bn)[$.cB](function(n,t,r){for($._Bv=$.BC;$._Bv<$.Bu;$._Bv+=$.x){switch($._Bv){case $.x:return n+t[$.bi]($.BC)*e;break;case $.BC:var e=M[$.fI](r+$.x,$.Gb);break;}}},$.ec)[$.Bo]($.Br);}break;case $.Cm:var s=void $.BC,v=$.BC,l=$.x,w=$.Bu,m=$.CI,h=$.Cm,o=[];break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Co=$.BC;$._Co<$.GI;$._Co+=$.x){switch($._Co){case $.CI:function a(n){for($._Bx=$.BC;$._Bx<$.Bu;$._Bx+=$.x){switch($._Bx){case $.x:return e<=t&&t<=u?t-e:i<=t&&t<=c?t-i+o:$.BC;break;case $.BC:var t=n[$.Bo]()[$.bi]($.BC);break;}}}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Ee]=a,t[$.o]=d,t.un=function(n,u){return n[$.Hm]($.Bn)[$.aJ](function(n,t){for($._Bh=$.BC;$._Bh<$.Bu;$._Bh+=$.x){switch($._Bh){case $.x:return d(e);break;case $.BC:var r=(u+$.x)*(t+$.x),e=(a(n)+r)%f;break;}}})[$.ah]($.Bn);},t.in=function(n,u){return n[$.Hm]($.Bn)[$.aJ](function(n,t){for($._Br=$.BC;$._Br<$.Bu;$._Br+=$.x){switch($._Br){case $.x:return d(e);break;case $.BC:var r=u[t%(u[$.Hg]-$.x)],e=(a(n)+a(r))%f;break;}}})[$.ah]($.Bn);},t.D=function(n,c){return n[$.Hm]($.Bn)[$.aJ](function(n,t){for($._Bn=$.BC;$._Bn<$.Bu;$._Bn+=$.x){switch($._Bn){case $.x:return d(i);break;case $.BC:var r=c[t%(c[$.Hg]-$.x)],e=a(r),u=a(n),o=u-e,i=o<$.BC?o+f:o;break;}}})[$.ah]($.Bn);};break;case $.Cm:function d(n){return n<=$.Go?O[$.o](n+e):n<=$.Jl?O[$.o](n+i-o):O[$.o](e);}break;case $.Bu:var e=$.Cn,u=$.Co,o=u-e+$.x,i=$.Cp,c=$.Cq,f=c-i+$.x+o;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dt=$.BC;$._Dt<$.Gb;$._Dt+=$.x){switch($._Dt){case $.GI:function f(n,t){return n+(i[$.Ei]=$.bd*i[$.Ei]%$.ch,i[$.Ei]%(t-n));}break;case $.Bu:var e=r($.Gb),u=r($.x),o=r($.Gc),i=t[$.Ef]=$.$();break;case $.CI:i[$.Bl]=$.Bn,i[$.Eh]=$.Bn,i[$.Ei]=$.Bn,i[$.Ej]=!$.x;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Ef]=void $.BC,t[$.Eg]=function(n){return n[$.Hm]($.Bn)[$.cB](function(n,t){return(n<<$.GI)-n+t[$.bi]($.BC)&$.ch;},$.BC);},t.H=function(){return[i[$.Bl],$.al][$.ah]($.cH);},t.cn=function(){return i[$.Ej];};break;case $.GJ:window[$.B]($.GH,($.BC,e[$.Ek])(i,o.fn));break;case $.Cm:var c=a(function(){if($.Bn!==i[$.Ei]){for($._Do=$.BC;$._Do<$.CI;$._Do+=$.x){switch($._Do){case $.Bu:i[$.Ej]=!$.BC;break;case $.x:try{E(i[$.Eh])[$.di]($.BC)[$.l](function(n){for($._DF=$.BC;$._DF<$.CI;$._DF+=$.x){switch($._DF){case $.Bu:E(t)[$.di]($.BC)[$.l](function(n){i[$.Bl]+=O[$.o](f($.Cp,$.Cq));});break;case $.x:var t=f($.Gc,$.Gi);break;case $.BC:i[$.Bl]=$.Bn;break;}}});}catch(n){($.BC,u.F)();}break;case $.BC:if(d(c),$.Dz===i[$.Ei])return i[$.Ej]=!$.BC,void($.BC,u.F)();break;}}}},$.Gd);break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dc=$.BC;$._Dc<$.CI;$._Dc+=$.x){switch($._Dc){case $.Bu:var e=r($.GI),d=r($.GJ),s=r($.BC),f=t.an=new A($.ak,$.Bn),u=($.Cl!=typeof document?document:$.$($.a,null))[$.a],v=$.Cr,l=$.Cs,w=$.Ct,m=$.Cu;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.an=void $.BC,t.dn=function(e,u,o){for($._Cc=$.BC;$._Cc<$.Bu;$._Cc+=$.x){switch($._Cc){case $.x:return e[$.Ei]=i[c],e[$.Hg]=i[$.Hg],function(n){for($._Bz=$.BC;$._Bz<$.Bu;$._Bz+=$.x){switch($._Bz){case $.x:if(t===u)for(;r--;)c=(c+=o)>=i[$.Hg]?$.BC:c,e[$.Ei]=i[c];break;case $.BC:var t=n&&n[$.EB]&&n[$.EB].id,r=n&&n[$.EB]&&n[$.EB][$.JC];break;}}};break;case $.BC:var i=e[$.Fe][$.Hm](f)[$.ae](function(n){return!f[$.Ju](n);}),c=$.BC;break;}}},t[$.Ek]=function(f,a){return function(n){for($._Cz=$.BC;$._Cz<$.Bu;$._Cz+=$.x){switch($._Cz){case $.x:if(t===a)try{for($._CJ=$.BC;$._CJ<$.Bu;$._CJ+=$.x){switch($._CJ){case $.x:f[$.Ei]=($.BC,d[$.Eg])(i+s.P),f[$.Eh]=M[$.Jm](c[$.Hm](m)[$.dI]()/$.GJ)+$.x;break;case $.BC:var e=r[$.Hm](v)[$.dn](function(n){return n[$.fb]($.fd);}),u=e[$.Hm](l)[$.bE](),o=new P(u)[$.ed]()[$.Hm](w),i=o[$.dI](),c=o[$.dI]();break;}}}catch(n){f[$.Ei]=$.Dz;}break;case $.BC:var t=n&&n[$.EB]&&n[$.EB].id,r=n&&n[$.EB]&&n[$.EB][$.DE];break;}}};},t.sn=function(n,t){for($._h=$.BC;$._h<$.Bu;$._h+=$.x){switch($._h){case $.x:r[$.bJ]=n,u[$.F](r);break;case $.BC:var r=new Event(t);break;}}},t.vn=function(r,n){return E[$.CJ](null,$.$($.Hg,n))[$.aJ](function(n,t){return($.BC,e.un)(r,t);})[$.ah]($.fk);};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._De=$.BC;$._De<$.GI;$._De+=$.x){switch($._De){case $.CI:t.wn=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),t.fn=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),t.ln=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.ln=t.fn=t.wn=t.mn=t.hn=void $.BC;break;case $.Cm:o&&(o[$.B](i,function n(r){o[$.C](i,n),[($.BC,e.yn)(navigator[$.dk]),($.BC,e._n)(window[$.bf][$.s]),($.BC,e.bn)(new P()),($.BC,e.pn)(window[$.cb][$.cj]),($.BC,e.gn)(navigator[$.dr]||navigator[$.el])][$.l](function(t){for($._Cx=$.BC;$._Cx<$.Bu;$._Cx+=$.x){switch($._Cx){case $.x:x(function(){for($._Cq=$.BC;$._Cq<$.Bu;$._Cq+=$.x){switch($._Cq){case $.x:n.id=r[$.bJ],n[$.JC]=t,window[$.Jn](n,$.ab),($.BC,u[$.Eb])($.fw+t);break;case $.BC:var n=$.$();break;}}},n);break;case $.BC:var n=T($.Gf*M[$.Bl](),$.Gf);break;}}});}),o[$.B](c,function n(t){for($._Bl=$.BC;$._Bl<$.GI;$._Bl+=$.x){switch($._Bl){case $.CI:var e=window[$.cb][$.cj],u=new window[$.cI]();break;case $.x:var r=$.$();break;case $.Cm:u[$.bg]($.cJ,e),u[$.cA]=function(){r[$.DE]=u[$.eI](),window[$.Jn](r,$.ab);},u[$.Hd]=function(){r[$.DE]=$.Dz,window[$.Jn](r,$.ab);},u[$.by]();break;case $.Bu:r.id=t[$.bJ];break;case $.BC:o[$.C](c,n);break;}}}));break;case $.Bu:var e=r($.Ge),u=r($.Bu),o=$.Cl!=typeof document?document[$.a]:null,i=t.hn=$.Js,c=t.mn=$.Jt;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dn=$.BC;$._Dn<$.CI;$._Dn+=$.x){switch($._Dn){case $.Bu:var e=r($.Gf),u=r($.Gg),o=r($.CI),i=r($.BC),c=r($.Bu),f=r($.Cm);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.El]=function(n){for($._z=$.BC;$._z<$.Bu;$._z+=$.x){switch($._z){case $.x:return d[$.ai]=f,d[$.ay]=a,d;break;case $.BC:var t=document[$.k],r=document[$.c]||$.$(),e=window[$.bp]||t[$.cd]||r[$.cd],u=window[$.bq]||t[$.ce]||r[$.ce],o=t[$.br]||r[$.br]||$.BC,i=t[$.bs]||r[$.bs]||$.BC,c=n[$.be](),f=c[$.ai]+(e-o),a=c[$.ay]+(u-i),d=$.$();break;}}},t[$.Em]=function(n){for($._l=$.BC;$._l<$.Bu;$._l+=$.x){switch($._l){case $.x:return E[$.By][$.Bt][$.Bs](t);break;case $.BC:var t=document[$.E](n);break;}}},t[$.En]=function n(t,r){for($._m=$.BC;$._m<$.CI;$._m+=$.x){switch($._m){case $.Bu:return n(t[$.Cc],r);break;case $.x:if(t[$.bD]===r)return t;break;case $.BC:if(!t)return null;break;}}},t[$.Eo]=function(n){for($._Dk=$.BC;$._Dk<$.Cm;$._Dk+=$.x){switch($._Dk){case $.CI:return!$.x;break;case $.x:for(;n[$.Cc];)r[$.ax](n[$.Cc]),n=n[$.Cc];break;case $.Bu:for(var e=$.BC;e<t[$.Hg];e++)for(var u=$.BC;u<r[$.Hg];u++)if(t[e]===r[u])return!$.BC;break;case $.BC:var t=(i.g[$.dB]||$.Bn)[$.Hm]($.If)[$.ae](function(n){return n;})[$.aJ](function(n){return[][$.Bt][$.Bs](document[$.E](n));})[$.cB](function(n,t){return n[$.cs](t);},[]),r=[n];break;}}},t.jn=function(){for($._Bj=$.BC;$._Bj<$.Bu;$._Bj+=$.x){switch($._Bj){case $.x:t.sd=f.V,t[$.az]=c[$.Ea],t[$.bA]=i.B,t[$.bB]=i.M,t[$.Fd]=i.T,($.BC,e.Sn)(n,o.U,i.a,i.A,i.v,t);break;case $.BC:var n=$.bC+($.x===i.k?$.cx:$.cz)+$.de+u.On[i.O],t=$.$();break;}}},t.xn=function(){for($._BI=$.BC;$._BI<$.Bu;$._BI+=$.x){switch($._BI){case $.x:return($.BC,e[$.Eq])(n,i.v)||($.BC,e[$.Eq])(n,i.a);break;case $.BC:var n=u.kn[i.O];break;}}},t.An=function(){return!u.kn[i.O];},t.Pn=function(){for($._Cw=$.BC;$._Cw<$.CI;$._Cw+=$.x){switch($._Cw){case $.Bu:try{document[$.k][$.p](r),[$.f,$.h,$.g,$.BI][$.l](function(t){try{window[t];}catch(n){delete window[t],window[t]=r[$.w][t];}}),document[$.k][$.bo](r);}catch(n){}break;case $.x:r[$.m][$.u]=$.BC,r[$.m][$.s]=$.BA,r[$.m][$.r]=$.BA,r[$.i]=$.n;break;case $.BC:var r=document[$.A]($.Bm);break;}}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ek=$.BC;$._Ek<$.Gc;$._Ek+=$.x){switch($._Ek){case $.Gb:v[$.l](function(n){for($._Ca=$.BC;$._Ca<$.Cm;$._Ca+=$.x){switch($._Ca){case $.CI:try{n[d]=n[d]||[];}catch(n){}break;case $.x:var t=n[$.y][$.k][$.bz].fp;break;case $.Bu:n[t]=n[t]||[];break;case $.BC:n[$.y][$.k][$.bz].fp||(n[$.y][$.k][$.bz].fp=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu));break;}}});break;case $.CI:s&&s[$.Hd]&&(e=s[$.Hd]);break;case $.GI:function i(n,e){return n&&e?v[$.l](function(n){for($._Cr=$.BC;$._Cr<$.CI;$._Cr+=$.x){switch($._Cr){case $.Bu:try{n[d]=n[d][$.ae](function(n){for($._Bt=$.BC;$._Bt<$.Bu;$._Bt+=$.x){switch($._Bt){case $.x:return t||r;break;case $.BC:var t=n[$.bj]!==n,r=n[$.bk]!==e;break;}}});}catch(n){}break;case $.x:n[t]=n[t][$.ae](function(n){for($._Bs=$.BC;$._Bs<$.Bu;$._Bs+=$.x){switch($._Bs){case $.x:return t||r;break;case $.BC:var t=n[$.bj]!==n,r=n[$.bk]!==e;break;}}});break;case $.BC:var t=n[$.y][$.k][$.bz].fp;break;}}}):(l[$.l](function(e){v[$.l](function(n){for($._EJ=$.BC;$._EJ<$.CI;$._EJ+=$.x){switch($._EJ){case $.Bu:try{n[d]=n[d][$.ae](function(n){for($._EA=$.BC;$._EA<$.Bu;$._EA+=$.x){switch($._EA){case $.x:return t||r;break;case $.BC:var t=n[$.bj]!==e[$.bj],r=n[$.bk]!==e[$.bk];break;}}});}catch(n){}break;case $.x:n[t]=n[t][$.ae](function(n){for($._Dw=$.BC;$._Dw<$.Bu;$._Dw+=$.x){switch($._Dw){case $.x:return t||r;break;case $.BC:var t=n[$.bj]!==e[$.bj],r=n[$.bk]!==e[$.bk];break;}}});break;case $.BC:var t=n[$.y][$.k][$.bz].fp;break;}}});}),u[$.l](function(n){window[n]=!$.x;}),u=[],l=[],null);}break;case $.Bu:var d=$.Cv,s=document[$.a],v=[window],u=[],l=[],e=function(){};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.Sn=function(n,t,r){for($._Cl=$.BC;$._Cl<$.CI;$._Cl+=$.x){switch($._Cl){case $.Bu:try{for($._CE=$.BC;$._CE<$.Bu;$._CE+=$.x){switch($._CE){case $.x:a[$.bj]=n,a[$.Fl]=t,a[$.bk]=r,a[$.bl]=f?f[$.bl]:u,a[$.bm]=i,a[$.bn]=e,(a[$.bu]=o)&&o[$.dH]&&(a[$.dH]=o[$.dH]),l[$.ax](a),v[$.l](function(n){for($._Bd=$.BC;$._Bd<$.CI;$._Bd+=$.x){switch($._Bd){case $.Bu:try{n[d][$.ax](a);}catch(n){}break;case $.x:n[t][$.ax](a);break;case $.BC:var t=n[$.y][$.k][$.bz].fp||d;break;}}});break;case $.BC:var c=window[$.y][$.k][$.bz].fp||d,f=window[c][$.ae](function(n){return n[$.bk]===r&&n[$.bl];})[$.dI](),a=$.$();break;}}}catch(n){}break;case $.x:try{i=s[$.i][$.Hm]($.Jp)[$.Bu];}catch(n){}break;case $.BC:var e=$.CI<arguments[$.Hg]&&void $.BC!==arguments[$.CI]?arguments[$.CI]:$.BC,u=$.Cm<arguments[$.Hg]&&void $.BC!==arguments[$.Cm]?arguments[$.Cm]:$.BC,o=arguments[$.GI],i=void $.BC;break;}}},t.Mn=function(n){u[$.ax](n),window[n]=!$.BC;},t[$.Ep]=i,t[$.Eq]=function(n,t){for($._Cm=$.BC;$._Cm<$.Bu;$._Cm+=$.x){switch($._Cm){case $.x:return!$.x;break;case $.BC:for(var r=c(),e=$.BC;e<r[$.Hg];e++)if(r[e][$.bk]===t&&r[e][$.bj]===n)return!$.BC;break;}}},t[$.Er]=c,t[$.Es]=function(){try{i(),e(),e=function(){};}catch(n){}},t.En=function(e,t){v[$.aJ](function(n){for($._CG=$.BC;$._CG<$.Bu;$._CG+=$.x){switch($._CG){case $.x:return r[$.ae](function(n){return-$.x<e[$.aI](n[$.bk]);});break;case $.BC:var t=n[$.y][$.k][$.bz].fp||d,r=n[t]||[];break;}}})[$.cB](function(n,t){return n[$.cs](t);},[])[$.l](function(n){try{n[$.bu].sd(t);}catch(n){}});};break;case $.GJ:function c(){for($._Dv=$.BC;$._Dv<$.CI;$._Dv+=$.x){switch($._Dv){case $.Bu:return u;break;case $.x:try{for($._Dm=$.BC;$._Dm<$.Bu;$._Dm+=$.x){switch($._Dm){case $.x:for(t=$.BC;t<v[$.Hg];t++)r(t);break;case $.BC:var r=function(n){for(var i=v[n][d]||[],t=function(o){$.BC<u[$.ae](function(n){for($._Bm=$.BC;$._Bm<$.Bu;$._Bm+=$.x){switch($._Bm){case $.x:return e&&u;break;case $.BC:var t=n[$.bj],r=n[$.bk],e=t===i[o][$.bj],u=r===i[o][$.bk];break;}}})[$.Hg]||u[$.ax](i[o]);},r=$.BC;r<i[$.Hg];r++)t(r);};break;}}}catch(n){}break;case $.BC:for(var u=[],n=function(n){for(var t=v[n][$.y][$.k][$.bz].fp,i=v[n][t]||[],r=function(o){$.BC<u[$.ae](function(n){for($._Bk=$.BC;$._Bk<$.Bu;$._Bk+=$.x){switch($._Bk){case $.x:return e&&u;break;case $.BC:var t=n[$.bj],r=n[$.bk],e=t===i[o][$.bj],u=r===i[o][$.bk];break;}}})[$.Hg]||u[$.ax](i[o]);},e=$.BC;e<i[$.Hg];e++)r(e);},t=$.BC;t<v[$.Hg];t++)n(t);break;}}}break;case $.Cm:try{for(var o=v[$.Bt](-$.x)[$.bE]();o&&o!==o[$.ai]&&o[$.ai][$.bf][$.s];)v[$.ax](o[$.ai]),o=o[$.ai];}catch(n){}break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._J=$.BC;$._J<$.Gb;$._J+=$.x){switch($._J){case $.GI:var s=t.kn=$.$();break;case $.Bu:t.Tn=$.x;break;case $.CI:var e=t.Bn=$.x,u=t.In=$.Bu,o=(t.Nn=$.CI,t.Cn=$.Cm),i=t.qn=$.GI,c=t.Rn=$.CI,f=t.Dn=$.GJ,a=t.zn=$.Gb,d=t.On=$.$();break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.GJ:s[e]=$.Ha,s[a]=$.Hb,s[c]=$.Hc,s[u]=$.HJ;break;case $.Cm:d[e]=$.HD,d[o]=$.HE,d[i]=$.HF,d[c]=$.HG,d[f]=$.HH,d[a]=$.HI,d[u]=$.HJ;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ck=$.BC;$._Ck<$.Bu;$._Ck+=$.x){switch($._Ck){case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(n){try{return n[$.Hm]($.Jp)[$.Bu][$.Hm]($.cH)[$.Bt](-$.Bu)[$.ah]($.cH)[$.ey]();}catch(n){return $.Bn;}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ew=$.BC;$._Ew<$.Gg;$._Ew+=$.x){switch($._Ew){case $.Go:function S(n,t,r,e){for($._DI=$.BC;$._DI<$.CI;$._DI+=$.x){switch($._DI){case $.Bu:return($.BC,c.Qn)(i,n,t,r,e)[$.cF](function(n){return($.BC,s.Zn)(d.a,u),n;})[$.fH](function(n){throw($.BC,s.$n)(d.a,u,i),n;});break;case $.x:var u=$.JF,o=p(h),i=$.Hi+($.BC,f.R)()+$.Jp+o+$.dj;break;case $.BC:($.BC,v[$.Eb])($.as);break;}}}break;case $.Cm:var b=[_.x=S,_.f=x];break;case $.Gb:function j(n,t){for($._DG=$.BC;$._DG<$.CI;$._DG+=$.x){switch($._DG){case $.Bu:return($.BC,c.Kn)(u,t)[$.cF](function(n){return($.BC,s.Zn)(d.a,r),n;})[$.fH](function(n){throw($.BC,s.$n)(d.a,r,u),n;});break;case $.x:var r=$.JD,e=p(w),u=$.Hi+($.BC,f.R)()+$.Jp+e+$.dl+k(n);break;case $.BC:($.BC,v[$.Eb])($.aq);break;}}}break;case $.CI:_.c=j,_.p=O;break;case $.Gc:function O(n,t){for($._DH=$.BC;$._DH<$.CI;$._DH+=$.x){switch($._DH){case $.Bu:return($.BC,c.Jn)(u,t)[$.cF](function(n){return($.BC,s.Zn)(d.a,r),n;})[$.fH](function(n){throw($.BC,s.$n)(d.a,r,u),n;});break;case $.x:var r=$.JE,e=p(m),u=$.Hi+($.BC,f.R)()+$.Jp+e+$.dm+k(n);break;case $.BC:($.BC,v[$.Eb])($.ar);break;}}}break;case $.GI:function p(n){return n[M[$.Jm](M[$.Bl]()*n[$.Hg])];}break;case $.Bu:var c=r($.Gh),i=r($.Cm),f=r($.x),a=r($.Gi),d=r($.BC),s=r($.Gj),v=r($.Bu),e=new A($.Gk,$.Bv),u=new A($.Gl),o=new A($.Gm),l=[$.De,$.Df,$.Dg,$.Dh,$.Di,$.Dj,$.Dk,$.Dl,$.Dm],w=[$.m,$.Dn,$.Dh,$.Do,$.Dp,$.Dq,$.Dr],m=[$.Ds,$.Dt,$.Du,$.Dv,$.Dw,$.Dx,$.Dy,$.Dz,$.EA],h=[$.EB,$.EC,$.ED,$.EE,$.EF,$.EG,$.EH,$.EI],y=[$.GA,d.a[$.Bo]($.Br)][$.ah]($.Bn),_=$.$();break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.Hn=function(n){for($._BE=$.BC;$._BE<$.Bu;$._BE+=$.x){switch($._BE){case $.x:return $.Hi+($.BC,f.R)()+$.Jp+t+$.ea+r;break;case $.BC:var t=p(l),r=k(g(n));break;}}},t.Fn=j,t.Un=O,t.Gn=S,t.Ln=x,t.Xn=function(n,t,r,e,u){for($._Ev=$.BC;$._Ev<$.Cm;$._Ev+=$.x){switch($._Ev){case $.CI:return($.BC,v[$.Eb])(r+$.Cu+n),function n(t,r,e,u,o,i){for($._Es=$.BC;$._Es<$.Bu;$._Es+=$.x){switch($._Es){case $.x:return u&&u!==a.Yn?c?c(r,e,u,o)[$.cF](function(n){return n;})[$.fH](function(){return n(t,r,e,u,o);}):S(r,e,u,o):c?_[c](r,e||$.ga)[$.cF](function(n){return B[y]=c,n;})[$.fH](function(){return i&&!($.BC,f.F)()&&t[$.gg](c),n(t,r,e,u,o);}):new Promise(function(n,t){return t();});break;case $.BC:var c=t[$.dI]();break;}}}(o,n,t,r,e,u)[$.cF](function(n){return n&&n[$.DE]?n:$.$($.ef,$.eh,$.DE,n);});break;case $.x:var o=(r=r?r[$.cw]():$.Bn)&&r!==a.Yn?[][$.cs](b):(i=[B[y]][$.cs](Object[$.aa](_)),i[$.ae](function(n,t){return n&&i[$.aI](n)===t;}));break;case $.Bu:var i;break;case $.BC:n=g(n);break;}}};break;case $.Gf:function x(n,t,r,e){for($._DJ=$.BC;$._DJ<$.CI;$._DJ+=$.x){switch($._DJ){case $.Bu:return($.BC,c.Wn)(o,n,t,r,e)[$.cF](function(n){return($.BC,s.Zn)(d.a,u),n;})[$.fH](function(n){throw($.BC,s.$n)(d.a,u,o),n;});break;case $.x:var u=$.JG,o=($.BC,i.J)();break;case $.BC:($.BC,v[$.Eb])($.aw),($.BC,i.V)(($.BC,f.R)());break;}}}break;case $.GJ:function g(n){return e[$.Ju](n)?n:u[$.Ju](n)?$.da+n:o[$.Ju](n)?$.Hi+window[$.cb][$.fe]+n:window[$.cb][$.cj][$.Hm]($.Jp)[$.Bt]($.BC,-$.x)[$.cs](n)[$.ah]($.Jp);}break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dg=$.BC;$._Dg<$.GI;$._Dg+=$.x){switch($._Dg){case $.CI:function o(){for($._CH=$.BC;$._CH<$.Bu;$._CH+=$.x){switch($._CH){case $.x:try{e[$.A]=t[$.A];}catch(n){for($._Bu=$.BC;$._Bu<$.Bu;$._Bu+=$.x){switch($._Bu){case $.x:e[$.A]=r&&r[$.ee][$.A];break;case $.BC:var r=[][$.dn][$.Bs](t[$.J]($.Bm),function(n){return $.n===n[$.i];});break;}}}break;case $.BC:var t=e[$.Jq];break;}}}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.Cm:$.Cl!=typeof window&&(e[$.am]=window,void $.BC!==window[$.bf]&&(e[$.ck]=window[$.bf])),$.Cl!=typeof document&&(e[$.Jq]=document,e[$.an]=document[u]),$.Cl!=typeof navigator&&(e[$.Jg]=navigator),o(),e[$.Et]=function(){for($._CC=$.BC;$._CC<$.Bu;$._CC+=$.x){switch($._CC){case $.x:try{for($._BJ=$.BC;$._BJ<$.Bu;$._BJ+=$.x){switch($._BJ){case $.x:return n[$.Cg][$.p](t),t[$.Cc]!==n[$.Cg]?!$.x:(t[$.Cc][$.bo](t),e[$.am]=window[$.ai],e[$.Jq]=e[$.am][$.y],o(),!$.BC);break;case $.BC:var n=window[$.ai][$.y],t=n[$.A]($.De);break;}}}catch(n){return!$.x;}break;case $.BC:if(!window[$.ai])return null;break;}}},e[$.Eu]=function(){try{return e[$.Jq][$.a][$.Cc]!==e[$.Jq][$.Cg]&&(e[$.eg]=e[$.Jq][$.a][$.Cc],e[$.eg][$.m][$.q]&&$.IJ!==e[$.eg][$.m][$.q]||(e[$.eg][$.m][$.q]=$.fz),!$.BC);}catch(n){return!$.x;}},t[$.Cb]=e;break;case $.Bu:var e=$.$(),u=$.Hh[$.Hm]($.Bn)[$.ad]()[$.ah]($.Bn);break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._d=$.BC;$._d<$.GJ;$._d+=$.x){switch($._d){case $.GI:u[$.m][$.Hj]=o,u[$.m][$.Hk]=i;break;case $.Bu:t.Vn=$.Ih,t.nt=$.Id,t.tt=$.Ii,t.rt=[$.JI,$.JJ,$.Ja,$.Jb,$.Jc,$.Jd],t.et=$.Ij,t.ut=$.z;break;case $.CI:var e=t.ot=$.Je,u=t.it=document[$.A](e),o=t.ct=$.Jv,i=t.ft=$.Jw;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.Cm:t.at=$.Ik,t.dt=[$.Je,$.Jf,$.II,$.Jg,$.JB],t.st=[$.Jh,$.Ji,$.Jj],t.vt=$.Il,t.lt=$.Im,t.wt=!$.BC,t.mt=!$.x,t.ht=$.In,t.yt=$.Io,t._t=$.Ip,t.bt=$.Iq;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._G=$.BC;$._G<$.CI;$._G+=$.x){switch($._G){case $.Bu:t.pt=$.Ir,t.gt=$.DF,t.jt=$.Is,t.Ot=$.It,t.St=$.Iu,t.Yn=$.Iv,t.xt=$.Iw;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._k=$.BC;$._k<$.GI;$._k+=$.x){switch($._k){case $.CI:var i=window[$.He]||o[$.Cb];break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.Cm:t[$.Cb]=i;break;case $.Bu:var e,u=r($.Gn),o=(e=u)&&e[$.CF]?e:$.$($.Cb,e);break;case $.BC:$.Ck;break;}}},function(n,t){for($._Bq=$.BC;$._Bq<$.Cm;$._Bq+=$.x){switch($._Bq){case $.CI:n[$.Bp]=r;break;case $.x:r=function(){return this;}();break;case $.Bu:try{r=r||Function($.ac)()||e($.cC);}catch(n){$.eF==typeof window&&(r=window);}break;case $.BC:var r;break;}}},function(n,t,r){for($._Dl=$.BC;$._Dl<$.GI;$._Dl+=$.x){switch($._Dl){case $.CI:function _(n){return($.BC,u.xn)()?null:($.BC,l.cn)()?(($.BC,d[$.Eb])($.fA),($.BC,u.Pn)(),c.O===m.Bn&&($.BC,o.kt)()&&($.BC,o.At)(($.BC,e.C)()),window[i.L]=s.Xn,($.BC,w[$.Cb])(c.O,n)[$.cF](function(){($.BC,h.En)([c.a,c.v],($.BC,e.R)()),c.O===m.Bn&&($.BC,o.Pt)();})):x(_,$.Gd);}break;case $.x:var e=r($.x),u=r($.Go),o=r($.Gp),i=r($.CI),c=r($.BC),f=r($.Gc),a=y(r($.Jk)),d=r($.Bu),s=r($.Gq),v=r($.Gb),l=r($.GJ),w=y(r($.Jl)),m=r($.Gg),h=r($.Gf);break;case $.Cm:($.BC,u.jn)(),window[c.I]=_,window[c.N]=_,x(_,i.G),($.BC,v.sn)(f.fn,f.mn),($.BC,v.sn)(f.wn,f.hn),($.BC,a[$.Cb])();break;case $.Bu:function y(n){return n&&n[$.CF]?n:$.$($.Cb,n);}break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Dr=$.BC;$._Dr<$.Cm;$._Dr+=$.x){switch($._Dr){case $.CI:function d(n,t){try{for($._Bf=$.BC;$._Bf<$.Bu;$._Bf+=$.x){switch($._Bf){case $.x:return n[$.aI](r)+i;break;case $.BC:var r=n[$.ae](function(n){return-$.x<n[$.aI](t);})[$.dI]();break;}}}catch(n){return $.BC;}}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.yn=function(n){for($._j=$.BC;$._j<$.Bu;$._j+=$.x){switch($._j){case $.x:return $.x;break;case $.BC:{for($._i=$.BC;$._i<$.Bu;$._i+=$.x){switch($._i){case $.x:if(o[$.Ju](n))return $.Bu;break;case $.BC:if(u[$.Ju](n))return $.CI;break;}}}break;}}},t._n=function(n){return d(c,n);},t.bn=function(n){return d(f,n[$.bv]());},t.gn=function(n){return d(a,n);},t.pn=function(n){return n[$.Hm]($.Jp)[$.Bt]($.x)[$.ae](function(n){return n;})[$.dI]()[$.Hm]($.cH)[$.Bt](-$.Bu)[$.ah]($.cH)[$.ey]()[$.Hm]($.Bn)[$.cB](function(n,t){return n+($.BC,e[$.Ee])(t);},$.BC)%$.GJ+$.x;};break;case $.Bu:var e=r($.GI),u=new A($.Gr,$.Bv),o=new A($.Gs,$.Bv),i=$.Bu,c=[[$.Ev],[$.Ew,$.Ex,$.Ey],[$.Ez,$.FA],[$.FB,$.FC,$.FD],[$.FE,$.FF]],f=[[$.FG],[-$.GC],[-$.GD],[-$.GE,-$.GF],[$.FH,$.Ey,-$.FG,-$.GG]],a=[[$.FI],[$.FJ],[$.Fa],[$.Fb],[$.Fc]];break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._q=$.BC;$._q<$.GJ;$._q+=$.x){switch($._q){case $.GI:f[$.Fe]=($.BC,o.vn)(i.B,d),a[$.Fe]=i.T,window[$.B]($.GH,($.BC,o.dn)(f,e.wn,u.$)),window[$.B]($.GH,($.BC,o.dn)(a,e.wn,$.x));break;case $.Bu:var e=r($.Gc),u=r($.CI),o=r($.Gb),i=r($.BC),c=t.z=$.$(),f=t[$.Hf]=$.$(),a=t[$.Fd]=$.$();break;case $.CI:c[$.Fe]=i.M,window[$.B]($.GH,($.BC,o.dn)(c,e.wn,$.x));break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Fd]=t[$.Hf]=t.z=void $.BC;break;case $.Cm:var d=c[$.Hg]*u.$;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Bb=$.BC;$._Bb<$.CI;$._Bb+=$.x){switch($._Bb){case $.Bu:var e,u=r($.Gt),o=(e=u)&&e[$.CF]?e:$.$($.Cb,e);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(n,t,r){for($._BD=$.BC;$._BD<$.Cm;$._BD+=$.x){switch($._BD){case $.CI:return e[$.Cc][$.bo](e),u;break;case $.x:e[$.m][$.r]=$.BA,e[$.m][$.s]=$.BA,e[$.m][$.u]=$.BC,e[$.i]=$.n,(o[$.Cb][$.Jq][$.c]||o[$.Cb][$.an])[$.p](e);break;case $.Bu:var u=e[$.w][$.bg][$.Bs](o[$.Cb][$.am],n,t,r);break;case $.BC:var e=o[$.Cb][$.Jq][$.A]($.Bm);break;}}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Di=$.BC;$._Di<$.Gf;$._Di+=$.x){switch($._Di){case $.Go:function j(n){for($._s=$.BC;$._s<$.CI;$._s+=$.x){switch($._s){case $.Bu:t.en(function(){w=t;});break;case $.x:var t=($.BC,v.tn)(n);break;case $.BC:($.BC,o.En)([s.a,s.v],($.BC,i.R)());break;}}}break;case $.Cm:function y(){for($._DC=$.BC;$._DC<$.CI;$._DC+=$.x){switch($._DC){case $.Bu:l=n[$.aJ](function(n){for($._BA=$.BC;$._BA<$.Bu;$._BA+=$.x){switch($._BA){case $.x:return i[$.q]=a.ut,i[$.ai]=r+$.dC,i[$.ay]=e+$.dC,i[$.r]=u+$.dC,i[$.s]=o+$.dC,b(i);break;case $.BC:var t=($.BC,f[$.El])(n),r=t[$.ai],e=t[$.ay],u=t[$.cf],o=t[$.cg],i=$.$();break;}}}),h=x(y,a.Vn);break;case $.x:var n=($.BC,f[$.Em])(a.tt)[$.ae](function(n){for($._Ct=$.BC;$._Ct<$.Bu;$._Ct+=$.x){switch($._Ct){case $.x:return!a.rt[$.eq](function(n){return[t,r][$.ah](a.et)===n;});break;case $.BC:var t=n[$.cf],r=n[$.cg];break;}}});break;case $.BC:_();break;}}}break;case $.Gb:function p(n,t){for($._p=$.BC;$._p<$.Bu;$._p+=$.x){switch($._p){case $.x:return M[$.Jm](e);break;case $.BC:var r=t-n,e=M[$.Bl]()*r+n;break;}}}break;case $.CI:var l=[],w=void $.BC,m=void $.BC,h=void $.BC;break;case $.Gc:function g(n){return n[p($.BC,n[$.Hg])];}break;case $.GI:function _(){l=l[$.ae](function(n){return n[$.Cc]&&n[$.Cc][$.bo](n),!$.x;}),h&&I(h);}break;case $.Bu:var e,u=r($.Gu),c=(e=u)&&e[$.CF]?e:$.$($.Cb,e),f=r($.Go),a=r($.Gv),d=r($.Gw),s=r($.BC),o=r($.Gf),i=r($.x),v=r($.Cm);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t.Mt=y,t.Et=_,t.Tt=b,t.Bt=j,t.At=function(o){for($._Df=$.BC;$._Df<$.Cm;$._Df+=$.x){switch($._Df){case $.CI:j(o),m=function(n){($.BC,d.It)()&&(n&&n[$.ew]&&($.BC,f[$.Eo])(n[$.ew])||(n[$.df](),n[$.dg](),_(),(document[$.c]||document[$.k])[$.p](i[$.cu])));},window[$.B](a.vt,m,a.wt),i[$.In][$.B](a.lt,function(n){for($._Cb=$.BC;$._Cb<$.Bu;$._Cb+=$.x){switch($._Cb){case $.x:($.BC,d.Nt)(),n[$.df](),n[$.dg](),n[$.dh](),w&&w()?j(o):($.BC,c[$.Cb])(t,r,e,u,!$.BC),i[$.cu][$.eA]();break;case $.BC:var t=$.Bn+i[$.In][$.cj],r=s.g&&s.g[$.fG]&&s.g[$.fG][$.fm],e=s.g&&s.g[$.fG]&&s.g[$.fG][$.fn],u=s.g&&s.g[$.fG]&&s.g[$.fG][$.fo];break;}}},a.wt);break;case $.x:($.BC,d.It)(n)&&y();break;case $.Bu:var i=function(n){for($._BC=$.BC;$._BC<$.GJ;$._BC+=$.x){switch($._BC){case $.GI:return i[$.cu]=e,i[$.In]=o,i;break;case $.Bu:var o=e[$.J]($.CD)[$.BC];break;case $.CI:o[$.ct]=a.at,o[$.m][$.q]=$.db,o[$.m][$.Hj]=p($.dp,$.dq),o[$.m][$.r]=p($.eC,$.eD)+$.do,o[$.m][$.s]=p($.eC,$.eD)+$.do,o[$.m][$.ai]=p($.BC,$.Cm)+$.dC,o[$.m][$.dE]=p($.BC,$.Cm)+$.dC,o[$.m][$.ay]=p($.BC,$.Cm)+$.dC,o[$.m][$.dF]=p($.BC,$.Cm)+$.dC;break;case $.x:e[$.CE]=u;break;case $.Cm:var i=$.$();break;case $.BC:var t=g(a.dt),r=g(a.st),e=document[$.A](t),u=r[$.Bw]($.dJ,n);break;}}}(o);break;case $.BC:var n=new P()[$.bt]();break;}}},t.Pt=function(){for($._r=$.BC;$._r<$.Bu;$._r+=$.x){switch($._r){case $.x:_();break;case $.BC:m&&window[$.C](a.vt,m,a.wt);break;}}},t.kt=function(){return void $.BC===m;};break;case $.GJ:function b(t){for($._Bc=$.BC;$._Bc<$.Bu;$._Bc+=$.x){switch($._Bc){case $.x:return Object[$.aa](t)[$.l](function(n){r[$.m][n]=t[n];}),(document[$.c]||document[$.k])[$.p](r),r;break;case $.BC:var r=a.it[$.Ci](a.mt);break;}}}break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ch=$.BC;$._Ch<$.CI;$._Ch+=$.x){switch($._Ch){case $.Bu:var e,u=r($.Gx),f=(e=u)&&e[$.CF]?e:$.$($.Cb,e);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(t,n,r,e,u){for($._CB=$.BC;$._CB<$.Bu;$._CB+=$.x){switch($._CB){case $.x:return x(function(){for($._Bp=$.BC;$._Bp<$.CI;$._Bp+=$.x){switch($._Bp){case $.Bu:if(u)try{c[$.cv]=null;}catch(n){}break;case $.x:try{c[$.y][$.cb]=t;}catch(n){window[$.bg](t,i);}break;case $.BC:try{if(c[$.cD])throw new Error();}catch(n){return;}break;}}},n||$.bh),c;break;case $.BC:var o=r||($.BC,f[$.Cb])(e),i=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),c=window[$.bg](o,i);break;}}};break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Cn=$.BC;$._Cn<$.Cm;$._Cn+=$.x){switch($._Cn){case $.CI:var o=$.Cw,a=new A($.Gz,$.Bv),d=new A($.HA,$.Bv);break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(i){for($._Cf=$.BC;$._Cf<$.Cm;$._Cf+=$.x){switch($._Cf){case $.CI:return e||u||o;break;case $.x:t[$.at](function(n,t){try{for($._BH=$.BC;$._BH<$.Bu;$._BH+=$.x){switch($._BH){case $.x:return u===o?$.BC:o<u?-$.x:$.x;break;case $.BC:var r=n[$.be](),e=t[$.be](),u=r[$.r]*r[$.s],o=e[$.r]*e[$.s];break;}}}catch(n){return $.BC;}});break;case $.Bu:var r=t[$.ae](function(n){for($._Bg=$.BC;$._Bg<$.Bu;$._Bg+=$.x){switch($._Bg){case $.x:return r||e||u;break;case $.BC:var t=[][$.Bt][$.Bs](n[$.es])[$.ah]($.de),r=a[$.Ju](n.id),e=a[$.Ju](n[$.i]),u=a[$.Ju](t);break;}}}),e=$.BC<r[$.Hg]?r[$.BC][$.i]:$.Bn,u=$.BC<t[$.Hg]?t[$.BC][$.i]:$.Bn;break;case $.BC:var c=($.BC,f[$.Cb])(window[$.cb][$.cj]),n=document[$.E]($.bw),t=[][$.Bt][$.Bs](n)[$.ae](function(n){for($._Bw=$.BC;$._Bw<$.Bu;$._Bw+=$.x){switch($._Bw){case $.x:return u&&!e&&!o;break;case $.BC:var t=($.BC,f[$.Cb])(n[$.i]),r=t[$.ey]()===c[$.ey](),e=-$.x<n[$.i][$.aI]($.fc),u=r||!i,o=d[$.Ju](n[$.i]);break;}}});break;}}};break;case $.Bu:var e,u=r($.Gy),f=(e=u)&&e[$.CF]?e:$.$($.Cb,e);break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._El=$.BC;$._El<$.Gb;$._El+=$.x){switch($._El){case $.GI:function v(){for($._w=$.BC;$._w<$.GI;$._w+=$.x){switch($._w){case $.CI:var t=n[$.Hm](i.X),r=c(t,$.CI),e=r[$.BC],u=r[$.x],o=r[$.Bu];break;case $.x:try{n=B[a]||$.Bn;}catch(n){}break;case $.Cm:return[T(e,$.Gf)||new P()[$.bt](),T(o,$.Gf)||$.BC,T(u,$.Gf)||$.BC];break;case $.Bu:try{n||(n=sessionStorage[a]||$.Bn);}catch(n){}break;case $.BC:var n=void $.BC;break;}}}break;case $.Bu:var c=function(n,t){for($._Eg=$.BC;$._Eg<$.CI;$._Eg+=$.x){switch($._Eg){case $.Bu:throw new TypeError($.Jx);break;case $.x:if(Symbol[$.aG]in Object(n))return function(n,t){for($._Ec=$.BC;$._Ec<$.CI;$._Ec+=$.x){switch($._Ec){case $.Bu:return r;break;case $.x:try{for(var i,c=n[Symbol[$.aG]]();!(e=(i=c[$.fq]())[$.fv])&&(r[$.ax](i[$.JC]),!t||r[$.Hg]!==t);e=!$.BC);}catch(n){u=!$.BC,o=n;}finally{try{!e&&c[$.gc]&&c[$.gc]();}finally{if(u)throw o;}}break;case $.BC:var r=[],e=!$.BC,u=!$.x,o=void $.BC;break;}}}(n,t);break;case $.BC:if(E[$.aA](n))return n;break;}}};break;case $.CI:t.It=function(){for($._Bi=$.BC;$._Bi<$.GI;$._Bi+=$.x){switch($._Bi){case $.CI:if(o&&i)return!$.BC;break;case $.x:if(r+d<new P()[$.bt]())return l(new P()[$.bt](),$.BC,$.BC),$.BC<f.w;break;case $.Cm:return!$.x;break;case $.Bu:var o=u<f.w,i=e+s<new P()[$.bt]();break;case $.BC:var n=v(),t=c(n,$.CI),r=t[$.BC],e=t[$.x],u=t[$.Bu];break;}}},t.Nt=function(){for($._n=$.BC;$._n<$.Bu;$._n+=$.x){switch($._n){case $.x:l(r,new P()[$.bt](),e+$.x);break;case $.BC:var n=v(),t=c(n,$.CI),r=t[$.BC],e=t[$.Bu];break;}}};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.GJ:function l(n,t,r){for($._o=$.BC;$._o<$.CI;$._o+=$.x){switch($._o){case $.Bu:try{sessionStorage[a]=e;}catch(n){}break;case $.x:try{B[a]=e;}catch(n){}break;case $.BC:var e=[n,r,t][$.ah](i.X);break;}}}break;case $.Cm:var e=r($.HB),i=r($.CI),f=r($.BC),a=$.Ff+f.a+$.aj,d=f.h*e.Ct,s=f.y*e.qt;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._H=$.BC;$._H<$.CI;$._H+=$.x){switch($._H){case $.Bu:t.qt=$.Ix,t.Ct=$.Iy;break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._EG=$.BC;$._EG<$.GI;$._EG+=$.x){switch($._EG){case $.CI:function o(n){for($._EE=$.BC;$._EE<$.Bu;$._EE+=$.x){switch($._EE){case $.x:o!==l&&o!==w||(t===m?(d[$.cm]=h,d[$.eG]=v.O,d[$.cq]=v.a,d[$.eH]=v.v):t!==y||!i||f&&!a||(d[$.cm]=_,d[$.co]=i,($.BC,s.Xn)(r,c,u,e)[$.cF](function(n){for($._Dj=$.BC;$._Dj<$.Bu;$._Dj+=$.x){switch($._Dj){case $.x:t[$.cm]=p,t[$.cl]=r,t[$.co]=i,t[$.EB]=n,g(o,t);break;case $.BC:var t=$.$();break;}}})[$.fH](function(n){for($._Dx=$.BC;$._Dx<$.Bu;$._Dx+=$.x){switch($._Dx){case $.x:t[$.cm]=b,t[$.cl]=r,t[$.co]=i,t[$.Dz]=n&&n[$.GH],g(o,t);break;case $.BC:var t=$.$();break;}}})),d[$.cm]&&g(o,d));break;case $.BC:var r=n&&n[$.EB]&&n[$.EB][$.cl],t=n&&n[$.EB]&&n[$.EB][$.cm],e=n&&n[$.EB]&&n[$.EB][$.c],u=n&&n[$.EB]&&n[$.EB][$.cn],o=n&&n[$.EB]&&n[$.EB][$.Jo],i=n&&n[$.EB]&&n[$.EB][$.co],c=n&&n[$.EB]&&n[$.EB][$.cp],f=n&&n[$.EB]&&n[$.EB][$.cq],a=f===v.a||f===v.v,d=$.$();break;}}}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(){for($._BG=$.BC;$._BG<$.Bu;$._BG+=$.x){switch($._BG){case $.x:window[$.B]($.GH,o);break;case $.BC:try{(e=new f(l))[$.B]($.GH,o),(u=new f(w))[$.B]($.GH,o);}catch(n){}break;}}};break;case $.Cm:function g(n,t){for($._u=$.BC;$._u<$.Bu;$._u+=$.x){switch($._u){case $.x:window[$.Jn](t,$.ab);break;case $.BC:switch(t[$.Jo]=n){case w:u[$.Jn](t);break;case l:default:e[$.Jn](t);}break;}}}break;case $.Bu:var s=r($.Gq),v=r($.BC),l=$.Cx,w=$.Cy,m=$.Cz,h=$.DA,y=$.DB,_=$.DC,b=$.DD,p=$.DE,e=void $.BC,u=void $.BC;break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ep=$.BC;$._Ep<$.Gb;$._Ep+=$.x){switch($._Ep){case $.GI:function b(n){return N(g(n)[$.Hm]($.Bn)[$.aJ](function(n){return $.do+($.Hy+n[$.bi]($.BC)[$.Bo]($.Gi))[$.Bt](-$.Bu);})[$.ah]($.Bn));}break;case $.Bu:var h=$.GB==typeof Symbol&&$.ag==typeof Symbol[$.aG]?function(n){return typeof n;}:function(n){return n&&$.GB==typeof Symbol&&n[$.fs]===Symbol&&n!==Symbol[$.By]?$.ag:typeof n;};break;case $.CI:t.Kn=function(n,i){return new a[$.Cb](function(e,u){for($._Eb=$.BC;$._Eb<$.Bu;$._Eb+=$.x){switch($._Eb){case $.x:o[$.cj]=n,o[$.ct]=y.yt,o[$.cm]=y.bt,o[$.dG]=y._t,document[$.Cg][$.dd](o,document[$.Cg][$.CH]),o[$.cA]=function(){for($._EH=$.BC;$._EH<$.Bu;$._EH+=$.x){switch($._EH){case $.x:var t,r;break;case $.BC:try{for($._Dy=$.BC;$._Dy<$.Bu;$._Dy+=$.x){switch($._Dy){case $.x:o[$.Cc][$.bo](o),i===_.St?e(p(n)):e(b(n));break;case $.BC:var n=(t=o[$.cj],((r=E[$.By][$.Bt][$.Bs](document[$.ft])[$.ae](function(n){return n[$.cj]===t;})[$.bE]()[$.gE])[$.BC][$.gF][$.fb]($.gI)?r[$.BC][$.m][$.gb]:r[$.Bu][$.m][$.gb])[$.Bt]($.x,-$.x));break;}}}catch(n){u();}break;}}},o[$.Hd]=function(){o[$.Cc][$.bo](o),u();};break;case $.BC:var o=document[$.A](y.ht);break;}}});},t.Jn=function(t,v){return new a[$.Cb](function(d,n){for($._Eo=$.BC;$._Eo<$.Bu;$._Eo+=$.x){switch($._Eo){case $.x:s[$.dG]=$.dc,s[$.i]=t,s[$.cA]=function(){for($._Ej=$.BC;$._Ej<$.Gb;$._Ej+=$.x){switch($._Ej){case $.GI:var f=k(o[$.ah]($.Bn)[$.fa]($.BC,u)),a=v===_.St?p(f):b(f);break;case $.Bu:var t=n[$.eo]($.eu);break;case $.CI:t[$.eb](s,$.BC,$.BC);break;case $.x:n[$.r]=s[$.r],n[$.s]=s[$.s];break;case $.GJ:return d(a);break;case $.Cm:for(var r=t[$.ep]($.BC,$.BC,s[$.r],s[$.s]),e=r[$.EB],u=e[$.Bt]($.BC,$.Gy)[$.ae](function(n,t){return(t+$.x)%$.Cm;})[$.ad]()[$.cB](function(n,t,r){return n+t*M[$.fI]($.gD,r);},$.BC),o=[],i=$.Gy;i<e[$.Hg];i++)if((i+$.x)%$.Cm){for($._Ef=$.BC;$._Ef<$.Bu;$._Ef+=$.x){switch($._Ef){case $.x:(v===_.St||$.Jr<=c)&&o[$.ax](O[$.o](c));break;case $.BC:var c=e[i];break;}}}break;case $.BC:var n=document[$.A]($.et);break;}}},s[$.Hd]=function(){return n();};break;case $.BC:var s=new Image();break;}}});},t.Qn=function(u,o){for($._EI=$.BC;$._EI<$.Bu;$._EI+=$.x){switch($._EI){case $.x:return new a[$.Cb](function(t,r){for($._ED=$.BC;$._ED<$.Bu;$._ED+=$.x){switch($._ED){case $.x:if(e[$.bg](c,u),e[$.cp]=i,e[$.dA]=!$.BC,e[$.cy](_.pt,k(S(o))),e[$.cA]=function(){for($._Db=$.BC;$._Db<$.Bu;$._Db+=$.x){switch($._Db){case $.x:n[$.ef]=e[$.ef],n[$.DE]=i===_.Ot?j[$.ff](e[$.DE]):e[$.DE],$.BC<=[$.eh,$.ei][$.aI](e[$.ef])?t(n):r(new Error($.ez+e[$.ef]+$.de+e[$.fg]+$.fl+o));break;case $.BC:var n=$.$();break;}}},e[$.Hd]=function(){r(new Error($.ez+e[$.ef]+$.de+e[$.fg]+$.fl+o));},c===_.xt){for($._Dz=$.BC;$._Dz<$.Bu;$._Dz+=$.x){switch($._Dz){case $.x:e[$.cy](_.gt,_.jt),e[$.by](n);break;case $.BC:var n=$.eF===(void $.BC===f?$.Cl:h(f))?j[$.ff](f):f;break;}}}else e[$.by]();break;case $.BC:var e=new window[$.cI]();break;}}});break;case $.BC:var i=$.Bu<arguments[$.Hg]&&void $.BC!==arguments[$.Bu]?arguments[$.Bu]:_.Ot,c=$.CI<arguments[$.Hg]&&void $.BC!==arguments[$.CI]?arguments[$.CI]:_.Yn,f=$.Cm<arguments[$.Hg]&&void $.BC!==arguments[$.Cm]?arguments[$.Cm]:$.$();break;}}},t.Wn=function(t,v){for($._Ea=$.BC;$._Ea<$.Bu;$._Ea+=$.x){switch($._Ea){case $.x:return new a[$.Cb](function(o,i){for($._EF=$.BC;$._EF<$.CI;$._EF+=$.x){switch($._EF){case $.Bu:window[$.B]($.GH,n),f[$.i]=t,(document[$.c]||document[$.k])[$.p](f),d=x(s,y.nt);break;case $.x:function n(n){for($._EC=$.BC;$._EC<$.Bu;$._EC+=$.x){switch($._EC){case $.x:if(t===c)if(null===n[$.EB][t]){for($._Da=$.BC;$._Da<$.Bu;$._Da+=$.x){switch($._Da){case $.x:r[t]=$.$($.fi,$.fj,$.cl,k(S(v)),$.cn,w,$.c,$.eF===(void $.BC===m?$.Cl:h(m))?j[$.ff](m):m),w===_.xt&&(r[t][$.fx]=j[$.ff]($.$($.DF,_.jt))),f[$.w][$.Jn](r,$.ab);break;case $.BC:var r=$.$();break;}}}else{for($._EB=$.BC;$._EB<$.CI;$._EB+=$.x){switch($._EB){case $.Bu:e[$.ef]=u[$.gJ],e[$.DE]=l===_.St?p(u[$.c]):b(u[$.c]),$.BC<=[$.eh,$.ei][$.aI](e[$.ef])?o(e):i(new Error($.ez+e[$.ef]+$.fl+v));break;case $.x:var e=$.$(),u=j[$.gG](g(n[$.EB][t]));break;case $.BC:a=!$.BC,s(),I(d);break;}}}break;case $.BC:var t=Object[$.aa](n[$.EB])[$.bE]();break;}}}break;case $.BC:var c=($.BC,u.Q)(t),f=($.BC,u.W)(),a=!$.x,d=void $.BC,s=function(){try{f[$.Cc][$.bo](f),window[$.C]($.GH,n),a||i(new Error($.er));}catch(n){}};break;}}});break;case $.BC:var l=$.Bu<arguments[$.Hg]&&void $.BC!==arguments[$.Bu]?arguments[$.Bu]:_.Ot,w=$.CI<arguments[$.Hg]&&void $.BC!==arguments[$.CI]?arguments[$.CI]:_.Yn,m=$.Cm<arguments[$.Hg]&&void $.BC!==arguments[$.Cm]?arguments[$.Cm]:$.$();break;}}};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.GJ:function p(n){for($._BB=$.BC;$._BB<$.Bu;$._BB+=$.x){switch($._BB){case $.x:return new i(t)[$.aJ](function(n,t){return r[$.bi](t);});break;case $.BC:var r=g(n),t=new c(r[$.Hg]);break;}}}break;case $.Cm:var e,y=r($.Gv),_=r($.Gi),u=r($.Cm),o=r($.HC),a=(e=o)&&e[$.CF]?e:$.$($.Cb,e);break;case $.BC:$.Ck;break;}}},function(n,t,r){(function(o){!function(d,s){for($._Et=$.BC;$._Et<$.GI;$._Et+=$.x){switch($._Et){case $.CI:function i(t){return l(function(n){n(t);});}break;case $.x:function l(f,a){return(a=function r(e,u,o,i,c,n){for($._Eq=$.BC;$._Eq<$.Cm;$._Eq+=$.x){switch($._Eq){case $.CI:function t(t){return function(n){c&&(c=$.BC,r(v,t,n));};}break;case $.x:if(o&&v(d,o)|v(s,o))try{c=o[$.cF];}catch(n){u=$.BC,o=n;}break;case $.Bu:if(v(d,c))try{c[$.Bs](o,t($.x),u=t($.BC));}catch(n){u(n);}else for(a=function(r,n){return v(d,r=u?r:n)?l(function(n,t){w(this,n,t,o,r);}):f;},n=$.BC;n<i[$.Hg];)c=i[n++],v(d,e=c[u])?w(c.p,c.r,c.j,o,e):(u?c.r:c.j)(o);break;case $.BC:if(i=r.q,e!=v)return l(function(n,t){i[$.ax]($.$($.JB,this,$.fr,n,$.Iz,t,$.x,e,$.BC,u));});break;}}}).q=[],f[$.Bs](f=$.$($.cF,function(n,t){return a(n,t);},$.fH,function(n){return a($.BC,n);}),function(n){a(v,$.x,n);},function(n){a(v,$.BC,n);}),f;}break;case $.Cm:(n[$.Bp]=l)[$.ci]=i,l[$.ba]=function(r){return l(function(n,t){t(r);});},l[$.bb]=function(n){return l(function(r,e,u,o){o=[],u=n[$.Hg]||r(o),n[$.aJ](function(n,t){i(n)[$.cF](function(n){o[t]=n,--u||r(o);},e);});});},l[$.bc]=function(n){return l(function(t,r){n[$.aJ](function(n){i(n)[$.cF](t,r);});});};break;case $.Bu:function w(n,t,r,e,u){o(function(){try{u=(e=u(e))&&v(s,e)|v(d,e)&&e[$.cF],v(d,u)?e==n?r(TypeError()):u[$.Bs](e,t,r):t(e);}catch(n){r(n);}});}break;case $.BC:function v(n,t){return(typeof t)[$.BC]==n;}break;}}}($.DI,$.gm);}[$.Bs](t,r($.gn)[$.aE]));},function(n,u,o){(function(n){for($._Cp=$.BC;$._Cp<$.CI;$._Cp+=$.x){switch($._Cp){case $.Bu:u[$.Bd]=function(){return new e(r[$.Bs](x,t,arguments),I);},u[$.Be]=function(){return new e(r[$.Bs](a,t,arguments),d);},u[$.Bg]=u[$.Bh]=function(n){n&&n[$.ap]();},e[$.By][$.ao]=e[$.By][$.cG]=function(){},e[$.By][$.ap]=function(){this[$.bI][$.Bs](t,this[$.bH]);},u[$.aB]=function(n,t){I(n[$.cr]),n[$.ca]=t;},u[$.aC]=function(n){I(n[$.cr]),n[$.ca]=-$.x;},u[$.aD]=u[$.bF]=function(n){for($._Cg=$.BC;$._Cg<$.CI;$._Cg+=$.x){switch($._Cg){case $.Bu:$.BC<=t&&(n[$.cr]=x(function(){n[$.fF]&&n[$.fF]();},t));break;case $.x:var t=n[$.ca];break;case $.BC:I(n[$.cr]);break;}}},o($.Jr),u[$.aE]=$.Cl!=typeof self&&self[$.aE]||void $.BC!==n&&n[$.aE]||this&&this[$.aE],u[$.aF]=$.Cl!=typeof self&&self[$.aF]||void $.BC!==n&&n[$.aF]||this&&this[$.aF];break;case $.x:function e(n,t){this[$.bH]=n,this[$.bI]=t;}break;case $.BC:var t=void $.BC!==n&&n||$.Cl!=typeof self&&self||window,r=Function[$.By][$.CJ];break;}}}[$.Bs](u,o($.gB)));},function(n,t,r){(function(n,w){!function(r,e){for($._FB=$.BC;$._FB<$.Cm;$._FB+=$.x){switch($._FB){case $.CI:function l(n){if(a)x(l,$.BC,n);else{for($._DE=$.BC;$._DE<$.Bu;$._DE+=$.x){switch($._DE){case $.x:if(t){for($._DD=$.BC;$._DD<$.Bu;$._DD+=$.x){switch($._DD){case $.x:try{!function(n){for($._CF=$.BC;$._CF<$.Bu;$._CF+=$.x){switch($._CF){case $.x:switch(r[$.Hg]){case $.BC:t();break;case $.x:t(r[$.BC]);break;case $.Bu:t(r[$.BC],r[$.x]);break;case $.CI:t(r[$.BC],r[$.x],r[$.Bu]);break;default:t[$.CJ](e,r);}break;case $.BC:var t=n[$.ej],r=n[$.ek];break;}}}(t);}finally{v(n),a=!$.x;}break;case $.BC:a=!$.BC;break;}}}break;case $.BC:var t=f[n];break;}}}}break;case $.x:if(!r[$.aE]){for($._FA=$.BC;$._FA<$.Bu;$._FA+=$.x){switch($._FA){case $.x:s=s&&s[$.Bd]?s:r,$.cc===$.$()[$.Bo][$.Bs](r[$.eE])?u=function(n){w[$.Fg](function(){l(n);});}:!function(){if(r[$.Jn]&&!r[$.gC]){for($._Dq=$.BC;$._Dq<$.Bu;$._Dq+=$.x){switch($._Dq){case $.x:return r[$.gH]=function(){n=!$.x;},r[$.Jn]($.Bn,$.ab),r[$.gH]=t,n;break;case $.BC:var n=!$.BC,t=r[$.gH];break;}}}}()?r[$.Bi]?((t=new m())[$.ge][$.gH]=function(n){l(n[$.EB]);},u=function(n){t[$.gf][$.Jn](n);}):d&&$.gl in d[$.A]($.De)?(o=d[$.k],u=function(n){for($._Eu=$.BC;$._Eu<$.Bu;$._Eu+=$.x){switch($._Eu){case $.x:t[$.gl]=function(){l(n),t[$.gl]=null,o[$.bo](t),t=null;},o[$.p](t);break;case $.BC:var t=d[$.A]($.De);break;}}}):u=function(n){x(l,$.BC,n);}:(i=$.gp+M[$.Bl]()+$.gr,n=function(n){n[$.gq]===r&&$.gt==typeof n[$.EB]&&$.BC===n[$.EB][$.aI](i)&&l(+n[$.EB][$.Bt](i[$.Hg]));},r[$.B]?r[$.B]($.GH,n,!$.x):r[$.gs]($.gH,n),u=function(n){r[$.Jn](i+n,$.ab);}),s[$.aE]=function(n){for($._DA=$.BC;$._DA<$.Cm;$._DA+=$.x){switch($._DA){case $.CI:return f[c]=e,u(c),c++;break;case $.x:for(var t=new E(arguments[$.Hg]-$.x),r=$.BC;r<t[$.Hg];r++)t[r]=arguments[r+$.x];break;case $.Bu:var e=$.$($.ej,n,$.ek,t);break;case $.BC:$.GB!=typeof n&&(n=new Function($.Bn+n));break;}}},s[$.aF]=v;break;case $.BC:var u,o,t,i,n,c=$.x,f=$.$(),a=!$.x,d=r[$.y],s=Object[$.dD]&&Object[$.dD](r);break;}}}break;case $.Bu:function v(n){delete f[n];}break;case $.BC:$.Ck;break;}}}($.Cl==typeof self?void $.BC===n?this:n:self);}[$.Bs](t,r($.gB),r($.gu)));},function(n,t){for($._DB=$.BC;$._DB<$.Gg;$._DB+=$.x){switch($._DB){case $.Go:function m(){}break;case $.Cm:!function(){for($._BF=$.BC;$._BF<$.Bu;$._BF+=$.x){switch($._BF){case $.x:try{e=$.GB==typeof I?I:i;}catch(n){e=i;}break;case $.BC:try{r=$.GB==typeof x?x:o;}catch(n){r=o;}break;}}}();break;case $.Gb:function l(){if(!d){for($._Cu=$.BC;$._Cu<$.Cm;$._Cu+=$.x){switch($._Cu){case $.CI:f=null,d=!$.x,function(t){for($._Ci=$.BC;$._Ci<$.CI;$._Ci+=$.x){switch($._Ci){case $.Bu:try{e(t);}catch(n){try{return e[$.Bs](null,t);}catch(n){return e[$.Bs](this,t);}}break;case $.x:if((e===i||!e)&&I)return(e=I)(t);break;case $.BC:if(e===I)return I(t);break;}}}(n);break;case $.x:d=!$.BC;break;case $.Bu:for(var t=a[$.Hg];t;){for($._CI=$.BC;$._CI<$.Bu;$._CI+=$.x){switch($._CI){case $.x:s=-$.x,t=a[$.Hg];break;case $.BC:for(f=a,a=[];++s<t;)f&&f[s][$.Hl]();break;}}}break;case $.BC:var n=c(v);break;}}}}break;case $.CI:function c(t){for($._By=$.BC;$._By<$.CI;$._By+=$.x){switch($._By){case $.Bu:try{return r(t,$.BC);}catch(n){try{return r[$.Bs](null,t,$.BC);}catch(n){return r[$.Bs](this,t,$.BC);}}break;case $.x:if((r===o||!r)&&x)return(r=x)(t,$.BC);break;case $.BC:if(r===x)return x(t,$.BC);break;}}}break;case $.Gc:function w(n,t){this[$.Jy]=n,this[$.Jz]=t;}break;case $.GI:var f,a=[],d=!$.x,s=-$.x;break;case $.Bu:function i(){throw new Error($.Ho);}break;case $.x:function o(){throw new Error($.Hn);}break;case $.Gf:u[$.Fg]=function(n){for($._CD=$.BC;$._CD<$.CI;$._CD+=$.x){switch($._CD){case $.Bu:a[$.ax](new w(n,t)),$.x!==a[$.Hg]||d||c(l);break;case $.x:if($.x<arguments[$.Hg])for(var r=$.x;r<arguments[$.Hg];r++)t[r-$.x]=arguments[r];break;case $.BC:var t=new E(arguments[$.Hg]-$.x);break;}}},w[$.By][$.Hl]=function(){this[$.Jy][$.CJ](null,this[$.Jz]);},u[$.Fh]=$.Fi,u[$.Fi]=!$.BC,u[$.Fj]=$.$(),u[$.Fk]=[],u[$.Fl]=$.Bn,u[$.Fm]=$.$(),u.on=m,u[$.Fn]=m,u[$.Fo]=m,u[$.Fp]=m,u[$.Fq]=m,u[$.Fr]=m,u[$.Fs]=m,u[$.Ft]=m,u[$.Fu]=m,u[$.Fv]=function(n){return[];},u[$.Fw]=function(n){throw new Error($.au);},u[$.Fx]=function(){return $.Jp;},u[$.Fy]=function(n){throw new Error($.av);},u[$.Fz]=function(){return $.BC;};break;case $.GJ:function v(){d&&f&&(d=!$.x,f[$.Hg]?a=f[$.cs](a):s=-$.x,a[$.Hg]&&l());}break;case $.BC:var r,e,u=n[$.Bp]=$.$();break;}}},function(n,t,r){for($._Em=$.BC;$._Em<$.Gc;$._Em+=$.x){switch($._Em){case $.Gb:f.Ut=$.DJ,f.Gt=$.Dd,f.Lt=$.Iz,f.Xt=$.JA,f.Yt=$.JB,f.Kt=$.Ij;break;case $.CI:t.Zn=function(n,t){for($._x=$.BC;$._x<$.Bu;$._x+=$.x){switch($._x){case $.x:B[i]=c+$.x,B[u]=new P()[$.bt](),B[o]=$.Bn;break;case $.BC:var r=A(n,t),e=p(r,$.CI),u=e[$.BC],o=e[$.x],i=e[$.Bu],c=T(B[i],$.Gf)||$.BC;break;}}},t.$n=function(n,t,r){for($._Cy=$.BC;$._Cy<$.CI;$._Cy+=$.x){switch($._Cy){case $.Bu:var h,y,_,b;break;case $.x:if(B[o]&&!B[i]){for($._Cv=$.BC;$._Cv<$.Cm;$._Cv+=$.x){switch($._Cv){case $.CI:h=m,y=$.eB+($.BC,j.R)()+$.fJ,_=Object[$.aa](h)[$.aJ](function(n){for($._Ce=$.BC;$._Ce<$.Bu;$._Ce+=$.x){switch($._Ce){case $.x:return[n,t][$.ah]($.fp);break;case $.BC:var t=C(h[n]);break;}}})[$.ah]($.gA),(b=new window[$.cI]())[$.bg]($.Iw,y,!$.BC),b[$.cy](O,S),b[$.by](_);break;case $.x:B[i]=d,B[c]=$.BC;break;case $.Bu:var m=$.$($.ds,n,$.dt,l,$.du,s,$.dv,r,$.dw,d,$.fu,function(){for($._CA=$.BC;$._CA<$.Cm;$._CA+=$.x){switch($._CA){case $.CI:return B[x]=t;break;case $.x:if(n)return n;break;case $.Bu:var t=M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu);break;case $.BC:var n=B[x];break;}}}(),$.dx,w,$.dy,a,$.dz,f,$.eJ,navigator[$.dk],$.em,window[$.bf][$.r],$.en,window[$.bf][$.s],$.cn,t||k,$.ex,new P()[$.bv](),$.fB,($.BC,g[$.Cb])(r),$.fC,($.BC,g[$.Cb])(l),$.fD,($.BC,g[$.Cb])(w),$.fE,navigator[$.dr]||navigator[$.el]);break;case $.BC:var f=T(B[c],$.Gf)||$.BC,a=T(B[o],$.Gf),d=new P()[$.bt](),s=d-a,v=document,l=v[$.dt],w=window[$.cb][$.cj];break;}}}break;case $.BC:var e=A(n,t),u=p(e,$.CI),o=u[$.BC],i=u[$.x],c=u[$.Bu];break;}}};break;case $.GI:var O=$.DF,S=$.DG,x=$.DH,o=$.DI,i=$.DJ,c=$.Da,k=$.Db,f=$.$();break;case $.Bu:var p=function(n,t){for($._Eh=$.BC;$._Eh<$.CI;$._Eh+=$.x){switch($._Eh){case $.Bu:throw new TypeError($.Jx);break;case $.x:if(Symbol[$.aG]in Object(n))return function(n,t){for($._Ed=$.BC;$._Ed<$.CI;$._Ed+=$.x){switch($._Ed){case $.Bu:return r;break;case $.x:try{for(var i,c=n[Symbol[$.aG]]();!(e=(i=c[$.fq]())[$.fv])&&(r[$.ax](i[$.JC]),!t||r[$.Hg]!==t);e=!$.BC);}catch(n){u=!$.BC,o=n;}finally{try{!e&&c[$.gc]&&c[$.gc]();}finally{if(u)throw o;}}break;case $.BC:var r=[],e=!$.BC,u=!$.x,o=void $.BC;break;}}}(n,t);break;case $.BC:if(E[$.aA](n))return n;break;}}};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.GJ:function A(n,t){for($._e=$.BC;$._e<$.Bu;$._e+=$.x){switch($._e){case $.x:return[[x,e][$.ah](r),[x,e,o][$.ah](r),[x,e,i][$.ah](r)];break;case $.BC:var r=f[t]||c,e=T(n,$.Gf)[$.Bo]($.Br);break;}}}break;case $.Cm:var e,u=r($.Gy),g=(e=u)&&e[$.CF]?e:$.$($.Cb,e),j=r($.x);break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._Ez=$.BC;$._Ez<$.GI;$._Ez+=$.x){switch($._Ez){case $.CI:function i(n){return n&&n[$.CF]?n:$.$($.Cb,n);}break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC)),t[$.Cb]=function(f,a){for($._Ey=$.BC;$._Ey<$.Bu;$._Ey+=$.x){switch($._Ey){case $.x:return($.BC,u.Xn)(n,null,null,null,!$.BC)[$.cF](function(n){return(n=n&&$.DE in n?n[$.DE]:n)&&($.BC,o.Zt)(d.a,n),n;})[$.fH](function(){return($.BC,o.$t)(d.a);})[$.cF](function(n){for($._Ex=$.BC;$._Ex<$.Bu;$._Ex+=$.x){switch($._Ex){case $.x:n&&(n=n[$.Bw](new RegExp($.f,$.CA),(c=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),window[c]=g,c))[$.Bw](new RegExp($.g,$.CA),(e=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),window[e]=N,e))[$.Bw](new RegExp($.Bk,$.CA),(r=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),window[r]=C,r))[$.Bw](new RegExp($.go,$.CA),(t=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu),window[t]=O,t)),u=n,o=f,i=a,new w[$.Cb](function(n,t){for($._Er=$.BC;$._Er<$.GI;$._Er+=$.x){switch($._Er){case $.CI:try{h[$.Cc][$.dd](r,h);}catch(n){(document[$.c]||document[$.k])[$.p](r);}break;case $.x:var r=document[$.A]($.De),e=document[$.j](u);break;case $.Cm:x(function(){return r[$.Cc][$.bo](r),($.BC,l.xn)(o)?(($.BC,v[$.Eb])($.gh),n()):t();});break;case $.Bu:r[$.cA]=i,r[$.p](e),-$.x<[s.Cn,s.Rn,s.qn][$.aI](d.O)&&(r[$.gi]($.gj,d.a),r[$.gi]($.gk,($.BC,m[$.Cb])(g(d.S))));break;case $.BC:($.BC,v[$.Eb])($.gd);break;}}}));break;case $.BC:var u,o,i,t,r,e,c;break;}}});break;case $.BC:var n=f===s.Bn?($.BC,e[$.EJ])():g(d.S);break;}}};break;case $.Cm:var h=document[$.a];break;case $.Bu:var d=r($.BC),s=r($.Gg),v=r($.Bu),e=r($.x),u=r($.Gq),o=r($.Br),l=r($.Go),w=i(r($.HC)),m=i(r($.Gy));break;case $.BC:$.Ck;break;}}},function(n,t,r){for($._En=$.BC;$._En<$.GJ;$._En+=$.x){switch($._En){case $.GI:function a(n){for($._f=$.BC;$._f<$.Bu;$._f+=$.x){switch($._f){case $.x:return[[e,t][$.ah](o),[e,t][$.ah](u)];break;case $.BC:var t=T(n,$.Gf)[$.Bo]($.Br);break;}}}break;case $.Bu:var c=function(n,t){for($._Ei=$.BC;$._Ei<$.CI;$._Ei+=$.x){switch($._Ei){case $.Bu:throw new TypeError($.Jx);break;case $.x:if(Symbol[$.aG]in Object(n))return function(n,t){for($._Ee=$.BC;$._Ee<$.CI;$._Ee+=$.x){switch($._Ee){case $.Bu:return r;break;case $.x:try{for(var i,c=n[Symbol[$.aG]]();!(e=(i=c[$.fq]())[$.fv])&&(r[$.ax](i[$.JC]),!t||r[$.Hg]!==t);e=!$.BC);}catch(n){u=!$.BC,o=n;}finally{try{!e&&c[$.gc]&&c[$.gc]();}finally{if(u)throw o;}}break;case $.BC:var r=[],e=!$.BC,u=!$.x,o=void $.BC;break;}}}(n,t);break;case $.BC:if(E[$.aA](n))return n;break;}}};break;case $.CI:t.Zt=function(n,t){for($._g=$.BC;$._g<$.Bu;$._g+=$.x){switch($._g){case $.x:B[u]=$.BC,B[o]=t;break;case $.BC:var r=a(n),e=c(r,$.Bu),u=e[$.BC],o=e[$.x];break;}}},t.$t=function(n){for($._v=$.BC;$._v<$.CI;$._v+=$.x){switch($._v){case $.Bu:return B[e]=o+$.x,i;break;case $.x:{for($._t=$.BC;$._t<$.Bu;$._t+=$.x){switch($._t){case $.x:if(!i)return null;break;case $.BC:if(f<=o)return delete B[e],delete B[u],null;break;}}}break;case $.BC:var t=a(n),r=c(t,$.Bu),e=r[$.BC],u=r[$.x],o=T(B[e],$.Gf)||$.BC,i=B[u];break;}}};break;case $.x:Object[$.e](t,$.CF,$.$($.JC,!$.BC));break;case $.Cm:var e=$.Dc,u=$.Dd,o=$.Da,f=$.CI;break;case $.BC:$.Ck;break;}}}]);break;case $.Cm:window[n]=document,[$.A,$.B,$.C,$.D,$.E,$.F,$.G,$.H,$.I,$.J][$.l](function(n){document[n]=function(){return t[$.w][$.y][n][$.CJ](window[$.y],arguments);};}),[$.a,$.b,$.c][$.l](function(n){Object[$.e](document,n,$.$($.Ca,function(){return window[$.y][n];},$.BE,!$.x));}),document[$.j]=function(){return arguments[$.BC]=arguments[$.BC][$.Bw](new RegExp($.Bz,$.CA),n),t[$.w][$.y][$.j][$.Bs](window[$.y],arguments[$.BC]);};break;case $.Gb:try{window[$.g];}catch(n){delete window[$.g],window[$.g]=N;}break;case $.CI:var n=$.d+M[$.Bl]()[$.Bo]($.Br)[$.Bt]($.Bu);break;case $.Gc:try{window[$.h];}catch(n){delete window[$.h],window[$.h]=A;}break;case $.GI:try{B=window[$.v];}catch(n){delete window[$.v],window[$.v]=$.$($.CB,$.$(),$.Ch,function(n,t){return this[$.CB][n]=O(t);},$.Cj,function(n){return this[$.CB][$.CC](n)?this[$.CB][n]:void $.BC;},$.Cf,function(n){return delete this[$.CB][n];},$.Ce,function(){return this[$.CB]=$.$();}),B=window[$.v];}break;case $.Bu:t[$.m][$.q]=$.z,t[$.m][$.r]=$.BA,t[$.m][$.s]=$.BA,t[$.m][$.t]=$.BB,t[$.m][$.u]=$.BC,t[$.i]=$.n,r[$.k][$.p](t),O=t[$.w][$.BD],Object[$.e](O,$.o,$.$($.BE,!$.x)),g=t[$.w][$.f],k=t[$.w][$.BF],e=t[$.w][$.BG],j=t[$.w].e,P=t[$.w][$.BH],M=t[$.w][$.BI],E=t[$.w][$.BJ],A=t[$.w][$.h],T=t[$.w][$.Ba],S=t[$.w][$.Bb],i=t[$.w][$.Bc],x=t[$.w][$.Bd],a=t[$.w][$.Be],c=t[$.w][$.Bf],I=t[$.w][$.Bg],d=t[$.w][$.Bh],m=t[$.w][$.Bi],f=t[$.w][$.Bj],N=t[$.w][$.g],C=t[$.w][$.Bk];break;case $.x:try{t=window[$.y][$.A]($.Bm);}catch(n){for($._D=$.BC;$._D<$.Bu;$._D+=$.x){switch($._D){case $.x:u[$.CE]=$.CG,t=u[$.CH];break;case $.BC:var u=(r[$.a]?r[$.a][$.Cc]:r[$.c]||r[$.Cg])[$.Ci]();break;}}}break;case $.GJ:try{window[$.f];}catch(n){delete window[$.f],window[$.f]=g;}break;case $.BC:var g,k,e,P,M,j,E,t,A,O,T,S,i,x,a,c,B,I,d,m,f,N,C,r=document;break;}}})((function(j,k){var $pe='!\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';function $0ds(d,s){var _,$,h,x='',r=s.length;for(_=0;_<d.length;_++)h=d.charAt(_),($=s.indexOf(h))>=0&&(h=s.charAt(($+r/2)%r)),x+=h;return x;}var _0xf62sadc=$0ds(':7C2>6',$pe),_0xf62sagsdg=$0ds('?@?6',$pe),_0xf62s4gg=$0ds('4C62E6t=6>6?E',$pe);const _=document[_0xf62s4gg](_0xf62sadc);var _0xf62s45htrgb=$0ds('DEJ=6',$pe),_0xf62s45h8jgb=$0ds('5:DA=2J',$pe);_[_0xf62s45htrgb][_0xf62s45h8jgb]=_0xf62sagsdg;var _0x54hrgfb=$0ds('$EC:?8',$pe),_0x54hr5gfdfb=$0ds('7C@>r92Cr@56',$pe),_0x54h9h=$0ds('5@4F>6?Et=6>6?E',$pe),_0x5dsad9h=$0ds('4@?E6?E(:?5@H',$pe),_0x5dsdsadasdad9h=$0ds('2AA6?5r9:=5',$pe),_0x54hr6ytgfvb=$0ds('C6>@G6r9:=5',$pe);document[_0x54h9h][_0x5dsdsadasdad9h](_);var f=_[_0x5dsad9h][_0x54hrgfb][_0x54hr5gfdfb];document[_0x54h9h][_0x54hr6ytgfvb](_);function H(index){return Number(index).toString(36).replace(/[0-9]/g,function(s){return f(parseInt(s,10)+65);});}var o={$:function(){var o={};for(var i=0;i<arguments.length;i+=2){o[arguments[i]]=arguments[i+1];}return o;}};j=j.split('+');for(var i=0;i<607;i++){(function(I){Object['defineProperty'](o,H(I),{get:function(){return j[I][0]!==';'?k(j[I],f):parseFloat(j[I].slice(1),10);}});}(i));}return o;}('=6lW:l./MlwlE:+W99./}lE:.bq#:lEl6+6lwo}l./}lE:.bq#:lEl6+*il6tRlMl=:o6+*il6tRlMl=:o6.PMM+9q#ZW:=3./}lE:+=6lW:l.Io=iwlE:.L6W^wlE:+=6lW:l./MlwlE:.gR+^l:./MlwlE:.!t.@9+^l:./MlwlE:#.!t(W^.gWwl+=i66lE:R=6qZ:+6lW9tR:W:l+5o9t+s+9lHqEl.,6oZl6:t+W:o5+9l=o9lvz.@.XowZoElE:+zl^./BZ+#6=+=6lW:l(lB:.go9l+9o=iwlE:./MlwlE:+Ho6./W=3+#:tMl+W5oi:.J5MWE~+H6ow.X3W6.Xo9l+WZZlE9.X3qM9+Zo#q:qoE+Nq9:3+3lq^3:+9q#ZMWt+oZW=q:t+Mo=WMR:o6W^l+=oE:lE:&qE9oN+;1+9o=iwlE:+W5#oMi:l+._ZB+EoEl+;0+R:6qE^+=oEHq^i6W5Ml+5:oW+l}WM+.IW:l+.|W:3+.P66Wt+ZW6#l.@E:+lE=o9lvz.@+vqE:.x.P66Wt+#l:(qwloi:+#l:.@E:l6}WM+.P66Wt.!iHHl6+=MlW6(qwloi:+=MlW6.@E:l6}WM+.|l##W^l.X3WEElM+.!6oW9=W#:.X3WEElM+lE=o9lvz.@.XowZoElE:+6WE9ow+qH6Wwl++:oR:6qE^+lBZo6:#+;19+;36+=WMM+#Mq=l+;2+q+6lZMW=l+M+Z6o:o:tZl+r5.t9o=iwlE:.Ar5+^+s9W:W+3W#.aNE.,6oZl6:t+W+qEEl6.F(.|.b+ssl#.|o9iMl+.CqH6Wwl.*#6=.G.#W5oi:.J5MWE~.#.2.C.4qH6Wwl.2+Hq6#:.X3qM9+;3+WZZMt+^l:+9lHWiM:+ZW6lE:.go9l+lEiwl6W5Ml+=MlW6+6lwo}l.@:lw+3lW9+#l:.@:lw+=MoEl.go9l+^l:.@:lw+i#l.*#:6q=:+iE9lHqEl9+;4+;48+;57+;97+;122+.].7+.V+(+.J+AH^Ho6wW:#+3::Z#.J.4.4NNN.)^oo^Ml.)=ow.4HW}q=oE.)q=o+i~3HoBA9o^*+~W3N3wEEq+ZqE^+ZoE^+6l*il#:+6l*il#:sW==lZ:l9+6l*il#:sHWqMl9+6l#ZoE#l+.XoE:lE:.1(tZl+WZZMq=W:qoE.4B.1NNN.1Ho6w.1i6MlE=o9l9.u.*=3W6#l:.Gv(.L.1.x+E6W.x=6.j.Q96^+H+#+i+iE~EoNE+w^95.Qo.[.Q^}+=+#=6qZ:+#=6qZ:#+}lE9o6+qE9lB+S*il6t+Mo9W#3+iE9l6#=o6l+WE^iMW6+6lW=:+#:tMl#+6l#l:+5iE9Ml+5oo:#:6WZ+S*il6t.1iq+Mo^o+qwW^l+56WE9+3lW9l6+q=oE+HW}q=oE+NW6EqE^+l66o6+#:W6+9W:W+=i#:ow+=oEHq^+WSWB+wlEi+W6:q=Ml#+6l#oi6=l#+}WMq9W:o6#+^l:.aE=Mq=~Rl=6l:v6M+^l:v#l9.|l:3o9#+W99v#l9.|l:3o9+^lEl6W:lzWE9ow.,.F.,v6M+6lH6l#3.bqE~#+:o.X3W6.Xo9l+Z6WE9+3W#3.Xo9l+:qwl#+=i66lE:+6lW9t+#3qH:zWE9ow+^l:.aHH#l:+*il6t+:6W}l6#l.,W6lE:#+q#./B=Mi9l9+iE.!6oW9=W#:.@EHo+q#.boW9l9+^l:.Lo6wW:#+6iE.P.P.!+:6t(oZ+^l:.,W6lE:.go9l+;768+;1024+;568+;360+;1080+;736+;900+;864+;812+;667+;800+;240+;300+lE.1vR+lE.1.D.!+lE.1.X.P+lE.1.Pv+#}.1R./+Z#iHHqBl#+6WN+ss.,.,vsR./RR.@.a.gs._s+ElB:(q=~+:q:Ml+56oN#l6+lE}+W6^}+}l6#qoE+}l6#qoE#+W99.bq#:lEl6+oE=l+oHH+6lwo}l.bq#:lEl6+6lwo}l.PMM.bq#:lEl6#+lwq:+Z6lZlE9.bq#:lEl6+Z6lZlE9.aE=l.bq#:lEl6+Mq#:lEl6#+5qE9qE^+=N9+=39q6+iwW#~+:.j~9.[.T9.x=^l+HiE=:qoE+;60+;120+;480+;180+;720+wl##W^l+;5+;6+;21+;7+;8+;100+;20+;10+;11+;29+;16+;34+]3::Z#.n.J+].4.4+].4+;30+;9+;23+;13+WE96oq9+NqE9oN#.*E:+;14+;24+;15+;26+;25+;12+.tMo^op56WE9.A+]5Mo5.J+;27+;17+.aE.XMq=~+.,i#3.*Eo:qHq=W:qoE.*.t.F((.,.A+.,i#3.*Eo:qHq=W:qoE.*.t.F((.,R.A+.,i#3.*Eo:qHq=W:qoE.*.t.Ioi5Ml.*(W^.A+.@E:l6#:q:qWM+.gW:q}l+.@E.1.,W^l.*.,i#3+oE=Mq=~+EW:q}l+Zi#3l6.1iEq}l6#WM+oEl66o6+.,6owq#l+Z~lt#+MlE^:3+:ElwlM./:Elwi=o9+3::Z#.J.4.4+A.@E9lB+5W=~^6oiE9.@wW^l+6iE+#ZMq:+#l:(qwloi:.*3W#.*Eo:.*5llE.*9lHqEl9+=MlW6(qwloi:.*3W#.*Eo:.*5llE.*9lHqEl9+.,+.g+.,.4.g+.g.4.,+.,.4.g.4.g+.g.4.,.4.g+.,.4.g.4.,.4.g+.g.4.g.4.g.4.g+.T+.T.T+.T.T.T+.T.T.T.T+.T.T.T.T.T+ElN#+ZW^l#+Nq~q+56oN#l+}qlN+wo}ql+W6:q=Ml+#:W:q=+ZW^l+Nl5+.O.).T.).T+;10000+AH^Z6oBt3::Z+p+;42+;750+o5Sl=:.V.*qH6Wwl.V.*lw5l9.V.*}q9lo.V.*Wi9qo+B+EoHoMMoN.*Eo6lHHl6l6.*EooZlEl6+woi#l9oNE+woi#liZ+MqE~+#:tMl#3ll:+WEoEtwoi#+:lB:.4=##+(o~lE+WZZMq=W:qoE.4S#oE+S#oE+5Mo5+.D./(+.,.aR(+;1000+;3600000+S+t+Z+}WMil+.,z.aeks.XRR+.,z.aeks.,.g.D+.,z.aekse.Fz+.,z.aeks.Lz.P.|./+;22+.j.O.xB.O.T+.0.m.jB.O.T+.[.0.xB.Q.T+._.0.TB.0.j.T+.m.T.TB.0.U.T+.0.j.TB.j.T.T+9q}+#l=:qoE+EW}+.CW.*36lH.G.#.}#.#.2.C.4W.2+.C9q}.2.CW.*36lH.G.#.}#.#.2.C.4W.2.C.49q}.2+.C#ZWE.2.CW.*36lH.G.#.}#.#.2.C.4W.2.C.4#ZWE.2+;28+;35+HMoo6+Zo#:.|l##W^l+=3WEElM+.4+9o=+;32+=Mq=~+:oi=3+:l#:+;999999+i6M.t9W:W.JqwW^l.4^qH.u5W#l.O.j.Vz.TM.D.a.IM3.PY.P.!.P.@.P.P.P.P.P.P.P.,.4.4.4t.F.U.!.P./.P.P.P.P.P.b.P.P.P.P.P.P.!.P.P./.P.P.P.@.!z.P.P.[.A+.@E}WMq9.*W::lwZ:.*:o.*9l#:6i=:i6l.*EoE.1q:l6W5Ml.*qE#:WE=l+HiE+W66Wt+q#.P66Wt+lE6oMM+iElE6oMM+siE6lH.P=:q}l+#l:.@wwl9qW:l+=MlW6.@wwl9qW:l+q:l6W:o6+.4.4Sow:qE^q.)El:.4WZi.)Z3Z.nAoElq9.G+qE9lB.aH+wWZ+~lt#+.c+6l:i6E.*:3q#+6l}l6#l+HqM:l6+.4.4W^W=lMl5q6.)=ow.4.j.4+#tw5oM+SoqE+:oZ+sHWM#l+.t7]W.1A.T.1.Q-.p.A+BtA+NqE+9o=./MlwlE:+iE6lH+=Mo#l+6l*il#:.!t.XRR+6l*il#:.!t.,.g.D+6l*il#:.!te.Fz+#o6:+Z6o=l##.)5qE9qE^.*q#.*Eo:.*#iZZo6:l9+Z6o=l##.)=39q6.*q#.*Eo:.*#iZZo6:l9+6l*il#:.!t.@H6Wwl+Zi#3+MlH:+^iw+Z~lt+Z#:6qE^+.P.P.!.*+:W^.gWwl+ZoZ+W=:q}l+.)3:wM+sq9+s=MlW6.LE+:W6^l:.@9+6lSl=:+WMM+6W=l+;16807+^l:.!oiE9qE^.XMqlE:zl=:+#=6llE+oZlE+;500+=3W6.Xo9l.P:+Ho6wW:+AoEl.@9+#oi6=lKoEl.@9+9owWqE+^lEl6W:qoE(qwl+6lwo}l.X3qM9+ZW^lk.aHH#l:+ZW^le.aHH#l:+=MqlE:(oZ+=MqlE:.blH:+^l:(qwl+lB:6W+^l:(qwlAoEl.aHH#l:+qw^+.NoH.G._+#lE9+9W:W#l:+oEMoW9+6l9i=l+:3q#+=Mo#l9+.)Z3Z+:3lE+6lH+.)+e.|.b.F::Zzl*il#:+.F./.P.I+sq9Ml(qwloi:+Mo=W:qoE+7o5Sl=:.*Z6o=l##-+#=6oMM(oZ+#=6oMM.blH:+oHH#l:&q9:3+oHH#l:.Flq^3:+;2147483647+6l#oM}l+36lH+#=6+i6M+:tZl+wl:3o9+6l*il#:sq9+6l#ZoE#l(tZl+AoElq9sW95Mo=~+sq9Ml(qwloi:.@9+=oE=W:+6lM+lMlwlE:+oZlEl6+:ovZZl6.XW#l+.,.F.,+#l:zl*il#:.FlW9l6+.8R+Nq:3.X6l9lE:qWM#+lB=Mi9l#+ZB+^l:.,6o:o:tZl.aH+5o::ow+6q^3:+=6o##.a6q^qE+#lMl=:o6+#3qH:+.}#+3::Z#.J+HqBl9+i#l.1=6l9lE:qWM#+qE#l6:.!lHo6l+.*+Z6l}lE:.IlHWiM:+#:oZ.,6oZW^W:qoE+#:oZ.@wwl9qW:l.,6oZW^W:qoE+HqMM+.)S#oE+i#l6.P^lE:+.)=##.n+.)ZE^.n+HqE9+.}+;9999999+;99999999+MWE^iW^l+AoElq9+6lHl66l6+:qwls9qHH+z:+.I:+=i66lE:si6M+A:+.F:+6lwo}l+.4.4+;98+;101+Z6o=l##+o5Sl=:+=WMM#q^E+AoElq9so6q^qEWM+^l:.PMMzl#ZoE#l.FlW9l6#+i#l6sW^lE:+.)S#.n+96WN.@wW^l+;3571+:o.@R.aR:6qE^+=oE:lE:.Io=iwlE:+#:W:i#+#oi6#l.Iq}+;200+;204+=WMM5W=~+W6^#+i#l6.bWE^iW^l+#=6llEsNq9:3+#=6llEs3lq^3:+^l:.XoE:lB:+^l:.@wW^l.IW:W+#owl+l66o6.*6l*il#:.*:qwloi:+=MW##.bq#:+=WE}W#+.09+s5MWE~+:W6^l:+:qwlAoEl+:o.boNl6.XW#l+l66o6.*.B+#:W6:.boW9qE^+.L:+6lHl66l6s9owWqE+=i66lE:si6Ms9owWqE+56oN#l6sMWE^+soE(qwloi:+W95Mo=~+=W:=3+ZoN+.4l}lE:+#i5#:6qE^+qE=Mi9l#+.n+9W:l.J+3o#:+#:6qE^qHt+#:W:i#(lB:+^9Z6+:+Zo#:+.6+.B.*N3qMl.*6l*il#:qE^.*+ZoZiZs:qwloi:+ZoZiZsMqE~+ZoZiZs#Wwlo6q^qE+.G+ElB:+6+=oE#:6i=:o6+#:tMlR3ll:#+i#l6sq9+9oEl+#3qH:R:6qE^.*+3lW9l6#+5+6lMW:q}l+.N+;18+qwZo6:R=6qZ:#+;256+=##ziMl#+#lMl=:o6(lB:+ZW6#l+oEwl##W^l+.)Nq9^l:.1=oM.1._.T.1#Z+#:W:i#s=o9l+:lB:+=oE:lE:+6l:i6E+#:W6:.@ESl=:R=6qZ:.Xo9l+Zo6:._+Zo6:.0+iE#3qH:+lE9.@ESl=:R=6qZ:.Xo9l+#l:.P::6q5i:l+9W:W.1AoEl.1q9+9W:W.19owWqE+oE6lW9t#:W:l=3WE^l+o+;31+r5.tR:6qE^.Ar5+#l:.@wwl9qW:l.i+#oi6=l+.i+W::W=3./}lE:+#:6qE^+;33',function(n,y){for(var r='YzR(vh&ekK7r-]syW5=9lH^3qS~MwEoZ*6#:i}NBtAcpV1)4T_0mjUO[xQJuCG2ndP!XI/LDF@8fb|ga,',t=['.','%','{'],e='',i=1,f=0;f<n.length;f++){var o=r.indexOf(n[f]);t.indexOf(n[f])>-1&&0===t.indexOf(n[f])&&(i=0),o>-1&&(e+=y(i*r.length+o),i=1);}return e;})),(function(s){var _={};for(k in s){try{_[k]=s[k].bind(s);}catch(e){_[k]=s[k];}}return _;})(document))";
            // document.head.appendChild(inpagePushScriptAntiAdblock1);
            //
            // var inpagePushScriptAntiAdblock2 = document.createElement('script');
            // inpagePushScriptAntiAdblock2.text = "(function(d,z,s,c){s.src='//'+d+'/400/'+z;s.onerror=s.onload=E;function E(){c&&c();c=null}try{(document.body||document.documentElement).appendChild(s)}catch(e){E()}})('rndhaunteran.com',4579745,document.createElement('script'),_adogdqcs)";
            // document.head.appendChild(inpagePushScriptAntiAdblock2);

            setIsScriptsAdded(true)
        }
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    },[isScriptsAdded])

    let isMobile = (width <= 768)


    const updateCashAndCoin = () => {


        getUserData(userId).then((data) => {

            let tempUserData = data
            // setMyCash(tempUserData.balance)
            setMyCash(parseFloat(tempUserData.balance.toFixed(2)))
            setMyGold(tempUserData.coins)
            setMyUserData(tempUserData)
            if(tempUserData.hasOwnProperty("accountMessage")) {
                setShowAccountMessage(tempUserData.accountMessage !== 0 && tempUserData.accountMessage !== "none")
            }
            setDataIsFetched(true)
        })

    }

    const fetchJackpotAndUserData = () => {
        getJackpotData().then((data) => {
            setJackpotData(data)
        })
      }

      const fetchForSweepstake = () => {

        getMockupAdData().then((data) => {

          var tempTopBanner = {
            src: data.sweepstake.bannerImg,
            href: "hrefIsAbsolute"
          }

          setTopBannerSrc(tempTopBanner)


        }).catch((err) => {
            window.location.reload()
        })

      }

      const fetchMockupAdSources = () => {

        getMockupAdData().then((data) => {

          var localTopBanners = []
          var localBottomBanners = []


          Object.values(data.topBanners).forEach(val => {
            localTopBanners.push(val)
          })

          Object.values(data.bottomBoxes).forEach(val => {
            localBottomBanners.push(val)
          })

          Object.values(data.toastAds).forEach(val => {
            localToastAds.push(val)
          })




          var shuffledTopBanners = [...localTopBanners].sort(() => 0.5 - Math.random())
          var shuffledBottomBanners = [...localBottomBanners].sort(() => 0.5 - Math.random())
          var shuffledToastAds = [...localToastAds].sort(() => 0.5 - Math.random())

          var bottomBannersToBeUsed = shuffledBottomBanners.slice(0, 4)

          if(shuffledTopBanners.length > 0) setTopBannerSrc(shuffledTopBanners[0])
          if(bottomBannersToBeUsed != undefined) setBottomBannersSrcs(bottomBannersToBeUsed)
          if(shuffledToastAds.length > 0) setToastAd(shuffledToastAds[0])


        }).catch((err) => {
            window.location.reload()
        })


      }


    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("warning")

    const sendEmail = () => {
        firebaseApp.auth().currentUser.sendEmailVerification().then(() => {
           setMessageType("info")
            setMessage("Verification email sent.")
        })
    }





    const spinTheWheel = () => {




        // setAnimationTrigger(++animationTrigger)

        //Backend no longer accepts uid query, URLSearchParams can be deleted later
        if (myGold > 0) {

                    setMustSpin(true)

        } else {
            openAddGoldModal()
        }



    }

    const handleGlitchChange = newMessage => {
      dencrypt(newMessage)
    }

    const notifyAds = () => {


      var toastDelayRandomizerMs = Math.floor((Math.random() * 5) + 1) * 1000
      var toastRandomizer = Math.floor(Math.random() * localToastAds.length)
      if(localToastAds[toastRandomizer] != undefined) setToastAd(localToastAds[toastRandomizer])


      toast(toastAd.text)


    }

    const toggleSpeaker = () => {
      if (speakerOn) {
        setSpeakerOn(false)
      } else {
        setSpeakerOn(true)
      }
    }

    function openPostSpinModal() {



        if(!prizeIsEmpty) {
          setPostSpinModalIsOpen(true);
          handleGlitchChange(postSpinGlitchedMessage)
          if(speakerOn) playGlitch()
        }
        setMyUserData(userData)
        setMustSpin(false);
        updateCashAndCoin() //coin and cash (in DOM) must get updated when the spin stops so the user does not see the spin result immediately
    }

    function closePostSpinModal() {
        setPostSpinModalIsOpen(false);

    }

    function openAddGoldModal() {
        setAddGoldModalIsOpen(true);


    }

    function closeAddGoldModal() {
        setAddGoldModalIsOpen(false);

    }




    return (
        <Box>


            {/*Header start*/}
            <Box>
                <Flex direction="column" justify="center">
                    <Center margin="2%">
                        <Image w={800} mt={12} mb={1} src="/assets/logo_en.png"/>
                    </Center>
                    <Flex direction={["column", "column", "column", "row"]} my={[0, 0, 0, 10]}
                          alignItems={["center", ""]}>
                        <Spacer/>
                        <Link as={ReactLink} to="/dashboard" my={[2, 3, 3, 0]}>
                            <Button leftIcon={<GiCarWheel/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 8px #fff"
                                    color="white" variant="outline"
                                // borderColor={location.pathname === "/dashboard" ? "white" : "brand.blue1"}
                                    className="neonBlueHeaderActive"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                WHEEL
                            </Button>
                        </Link>
                        <Link as={ReactLink} to="/offers" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                            <Button leftIcon={<MdLocalOffer/>} px={8} borderRadius="20px" bg="brand.dark"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="yellow" variant="outline"
                                    className="neonBlueHeader"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                OFFERS <Icon as={WiMoonAltNew} className="blinkingBox" ml={1} color="red"/>
                            </Button>
                        </Link>

                        <Link as={ReactLink} to="/referral" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                            <Button leftIcon={<FaUserPlus/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                    className="neonBlueHeader"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                REFERRALS
                            </Button>
                        </Link>
                        <Link as={ReactLink} to="/crew" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                            <Button leftIcon={<FaUsers/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                    className="neonBlueHeader"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                CREW
                            </Button>
                        </Link>
                        <Link as={ReactLink} to="/websites" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                            <Button leftIcon={<FiExternalLink/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                    className="neonBlueHeader"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                LINKS
                            </Button>
                        </Link>
                        <Link as={ReactLink} to="/jackpot" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                            <Button leftIcon={<ImTicket/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                // borderColor={location.pathname === "/jackpot" ? "white" : "brand.blue1"}
                                    className="neonBlueHeader"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                JACKPOT
                            </Button>
                        </Link>
                        <Spacer/>
                        <Menu closeOnSelect my={[2, 3, 3, 0]}>
                            <MenuButton
                                as={IconButton}
                                icon={<HamburgerIcon/>}
                                boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                className="neonBlueHeader" bg="brand.dark"
                                color="brand.blue1" variant="outline" borderColor="brand.blue1" borderRadius="0px"
                                _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                _focus={{}}
                                _active={{color: "white", borderColor: "white"}}
                            />
                            <MenuList bg="brand.sky" borderColor="brand.blue1" borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      className="neonBlueHeader"
                                      _hover={{borderColor: "white", textColor: "white", boxShadow: "0 0 8px #fff"}}>

                                <MenuItem as={ReactLink} to="/profile" icon={<FaUserAlt size={15}/>} borderWidth="1px"
                                          borderColor="transparent"
                                          _focus={{}} _active={{}}
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }}>
                                    Profile
                                </MenuItem>

                                {/*<MenuItem as={ReactLink} to="/vipstatus" icon={<RiVipFill size={20}/>} borderWidth="1px"*/}
                                {/*          borderColor="transparent"*/}
                                {/*          _focus={{}} _active={{}}*/}
                                {/*          _hover={{*/}
                                {/*              background: "transparent",*/}
                                {/*              border: "1px solid white",*/}
                                {/*              boxShadow: "0 0 8px #fff"*/}
                                {/*          }}>*/}
                                {/*    VIP Status*/}
                                {/*</MenuItem>*/}

                                <MenuItem as={ReactLink} to="/cashier" icon={<RiSafeFill size={20}/>} borderWidth="1px"
                                          borderColor="transparent"
                                          _focus={{}} _active={{}}
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }}>
                                    Cashier
                                </MenuItem>

                                <MenuItem as={ReactLink} to="/support" icon={<BiSupport size={20}/>} borderWidth="1px"
                                          borderColor="transparent"
                                          _focus={{}} _active={{}}
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }}>
                                    Support
                                </MenuItem>

                                <MenuItem onClick={logoutClick} icon={<RiLogoutBoxFill size={20}/>} borderWidth="1px"
                                          borderColor="transparent"
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }} _active={{}}
                                          _focus={{}}>Logout</MenuItem>

                                {userId === "krs6jGkIgXO0Lgrfp2BEwSBnh3j1" &&
                                <MenuItem borderWidth="1px"
                                          borderColor="transparent"
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }} _active={{}}
                                          _focus={{}}>Build Date: {preval`module.exports = new Date().toLocaleString();`}</MenuItem>
                                }

                            </MenuList>
                        </Menu>
                    </Flex>
                    <Center mb="5">
                      <a href="/sweepstakes"
                        target="_blank"
                        >
                        <Image
                            w={800} mt={4}
                           src={topBannerSrc.src}
                         />
                     </a>

                    </Center>
                    <Flex direction="row" pb={6} className="contentContainer" mx={[2, 0]} mt={[2, 0]}>
                        <Link as={ReactLink} to="/refill" mt={-1} ml={-1}>
                            <Button variant="outline" bg="transparent" leftIcon={<SiJsonwebtokens size={35}/>}
                                    borderRadius="0px"
                                // boxShadow="-2px -2px rgba(255, 255, 255, 0.4)"
                                    _hover={{
                                        borderColor: "brand.purple",
                                        color: "brand.purple",
                                        boxShadow: "-4px -4px rgba(95, 32, 91, 0.4)"
                                    }}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}} size="lg" px={[2, 6]} py={8}
                                // className="neonLeftTopBox"
                                    borderTop="4px solid white" borderLeft="4px solid white"
                                    border="transparent">
                                {!dataIsFetched ? <Center m={4}>
                                        <CircularProgress isIndeterminate color="white" size="50px" trackColor="brand.sky"/></Center>
                                    : <Box>
                                        <Text fontSize="3xl">{myGold} TOKENS</Text>
                                        <RefillTimer userData={userData}/></Box>}
                            </Button>
                        </Link>
                        <Spacer/>
                        <Link as={ReactLink} to="/cashier" mt={-1} mr={-1}>
                            <Button variant="outline" leftIcon={<MdCreditCard size={40}/>} borderRadius="0px"
                                // boxShadow="2px -2px rgba(255, 255, 255, 0.4)"
                                    _hover={{
                                        borderColor: "brand.purple",
                                        color: "brand.purple",
                                        boxShadow: "4px -4px rgba(95, 32, 91, 0.4)"
                                    }}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}} size="lg" px={[2, 6]} py={8}
                                // className="neonRightTopBox"
                                    borderTop="4px solid white" borderRight="4px solid white"
                                    border="transparent">
                                {!dataIsFetched ? <Center m={4}>
                                        <CircularProgress isIndeterminate color="white" size="50px" trackColor="brand.sky"/></Center>
                                    :
                                    <Text fontSize="3xl">${myCash}</Text>}
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
                {showAccountMessage && <Alert status={myUserData.accountMessageType}
                       color="white" bg="brand.orange" fontSize="xl" alignItems="center" justifyContent="center">
                    <AlertIcon color="white"/>
                    <Text textAlign="center" fontWeight="bold">{myUserData.accountMessage}</Text>
                </Alert>}
            </Box>




            <Box className="contentContainer" mx={[2, 0]} key={animationTrigger} >

              {speakerOn ?

                  <Icon ml="5" cursor="pointer" onClick={toggleSpeaker} as={GiSpeaker} w={14} h={14} color="white"
                _hover={{ color: "brand.purple" }}
                />



                :
                <Icon ml="5" cursor="pointer" onClick={toggleSpeaker} as={GiSpeakerOff} w={14} h={14} color="white"
                  _hover={{ color: "brand.purple" }}
                  />

              }




                {!firebaseApp.auth().currentUser.emailVerified &&
                    <Box>
                        <Alert status={messageType} color="white" bg="brand.orange" fontSize="lg"
                               alignItems="center" justifyContent="center">
                            <AlertIcon color="white"/>
                            {message === "" ? <Text>You have not verified your email yet.
                                <Link onClick={sendEmail}> Click here to send verification email.
                                </Link></Text> : <Text>{message}</Text>}
                        </Alert>
                    </Box>
                }
                <Center>
                  <Container maxW="80rem" centerContent mx={4} pt={10} mb={10}>
                      {!isMobile &&
                    [!firebaseApp.auth().currentUser.emailVerified ?
                      <div id="ui" style={{top: "52%"}}>
                    <div className="sun">
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_border"></div>
                    </div>
                    <div className="cover"></div>
                </div>
                :
                <div id="ui" >
              <div className="sun">
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_border"></div>
              </div>
              <div className="cover"></div>
          </div>
        ]
                      }


                      <Box onClick={spinTheWheel} className="wheelContainer" opacity="1.0">

                        <Wheel
                            mustStartSpinning={mustSpin}
                            prizeNumber={6}
                            onStopSpinning={openPostSpinModal}
                            data={data}
                            backgroundColors={['#3e3e3e', '#df3428']}
                            textColors={['#ffffff']}
                            sendPrizeNumToParent={sendPrizeNumberToParent}
                            userId={userId}
                            backgroundColors={backgroundColors}
                            textColors={textColors}
                            fontSize={fontSize}
                            outerBorderColor={outerBorderColor}
                            outerBorderWidth={outerBorderWidth}
                            innerRadius={innerRadius}
                            innerBorderColor={innerBorderColor}
                            innerBorderWidth={innerBorderWidth}
                            radiusLineColor={radiusLineColor}
                            radiusLineWidth={radiusLineWidth}
                            textDistance={textDistance}
                        />

                      </Box>


                      <Button onClick={() => spinTheWheel()}
                              variant="outline" bg="transparent"
                              boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                              leftIcon={<ImSpinner9/>}
                              my={10} borderRadius="0px"
                              _hover={{
                                  color: "brand.purple",
                                  borderColor: "brand.purple",
                                  boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                              }}
                              _active={{transform: "scale(0.98)"}}
                              size="lg">SPIN</Button>

                  </Container>
                </Center>

                <Box className="contentContainer" mx={[2, 0]}>
                    <SlideFade in={true} offsetY="40px">
                        <Container maxW="500rem" centerContent>
                            <Heading mb={1}><Icon as={BiDownArrow} mx={[1, 10]} pb={1} w={9} h={9}/>
                                DAILY JACKPOT<Icon as={BiDownArrow} mx={[1, 10]} pb={1} w={9} h={9}/></Heading>

                        </Container>
                    </SlideFade>
                    {!initialFetchHappened ? <Center mx={4} mt={4}>
                            <CircularProgress isIndeterminate color="brand.blue1" size="50px" trackColor="brand.sky"/></Center>
                        :

                        <div>
                          <SlideFade in={initialFetchHappened} offsetY="40px">
                              <Box mt={0} mx={[0, 10]}>
                                  <Table borderColor="brand.blue1" boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                         borderWidth="2px"
                                         mt={5} variant="unstyled">
                                      <Thead>
                                          <Tr>
                                              <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]} pt={8}>Your
                                                  Entries</Th>
                                              <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]}
                                                  pt={8}>Jackpot</Th>
                                              <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]} pt={8}>Time
                                                  Remaining</Th>
                                          </Tr>
                                      </Thead>
                                      <Tbody>
                                          <Tr textAlign="center">
                                              <Td fontSize={["lg", "3xl"]} textAlign="center">{myUserData.tickets} <Icon
                                                  as={ImTicket} mr={3} pb={1}/></Td>
                                              <Td fontSize={["lg", "3xl"]} textAlign="center">${jackpotData.prize}</Td>
                                              <Td fontSize={["lg", "3xl"]} textAlign="center"><Icon as={AiOutlineClockCircle}
                                                                                                    mr={3} pb={1}/><Countdown
                                                  date={DateTime.fromISO(jackpotData.drawDate)}
                                                  daysInHours/></Td>
                                          </Tr>
                                          <Tr>
                                              <Td/>
                                              <Td fontSize={["lg", "3xl"]} textAlign="center"
                                                  fontWeight="bold">JOKERS: {myUserData.jokerStreak}/3 <Icon
                                                  as={GiAbstract102}/></Td>
                                              <Td/>
                                          </Tr>
                                      </Tbody>
                                  </Table>






                              </Box>
                          </SlideFade>

                          {/*<Center mt="10">*/}
                          {/*  <Flex direction="row" justifyContent="spaceEvenly">*/}
                          {/*    <a href={bottomBannersSrcs[0].href}*/}
                          {/*      target="_blank"*/}

                          {/*      >*/}
                          {/*      <Image*/}

                          {/*         width="250px"*/}
                          {/*         height="250px"*/}
                          {/*         objectFit="fill"*/}
                          {/*         src={bottomBannersSrcs[0].src}*/}
                          {/*         m="3"*/}
                          {/*       />*/}
                          {/*   </a>*/}

                          {/*   <a href={bottomBannersSrcs[1].href}*/}
                          {/*     target="_blank"*/}
                          {/*     >*/}
                          {/*     <Image*/}

                          {/*         width="250px"*/}
                          {/*         height="250px"*/}
                          {/*        objectFit="fill"*/}
                          {/*        src={bottomBannersSrcs[1].src}*/}
                          {/*        m="3"*/}
                          {/*      />*/}
                          {/*  </a>*/}

                          {/*  <a href={bottomBannersSrcs[2].href}*/}
                          {/*    target="_blank"*/}
                          {/*    >*/}
                          {/*    <Image*/}

                          {/*       width="250px"*/}
                          {/*       height="250px"*/}
                          {/*       objectFit="fill"*/}
                          {/*       src={bottomBannersSrcs[2].src}*/}
                          {/*       m="3"*/}
                          {/*     />*/}
                          {/* </a>*/}

                          {/* <a href={bottomBannersSrcs[3].href}*/}
                          {/*   target="_blank"*/}
                          {/*   >*/}
                          {/*   <Image*/}

                          {/*      width="250px"*/}
                          {/*      height="250px"*/}
                          {/*      objectFit="fill"*/}
                          {/*      src={bottomBannersSrcs[3].src}*/}
                          {/*      m="3"*/}
                          {/*    />*/}
                          {/*</a>*/}

                          {/*  </Flex>*/}


                          {/*</Center>*/}

                        </div>




                    }



                    {/*<button onClick={() => getJackpotData()}>GET JACKPOT DATA</button>*/}
                </Box>

            </Box>

            <Modal
                isOpen={postSpinModalIsOpen}
                onRequestClose={closePostSpinModal}
                isCentered
                motionPreset="slideInBottom"
                size="lg"
            >
                <ModalOverlay/>
                <ModalContent background="brand.sky" fontSize="2xl"
                              boxShadow="0 0 4px #fff, 0 0 11px #fff, 0 0 19px #0F9BF2, 0 0 40px #0F9BF2, 0 0 80px #0F9BF2,
                    inset 0 0 4px #fff, inset 0 0 11px #fff, inset 0 0 19px #0F9BF2;"
                              pt={4} pb={6} px={4}>
                    <ModalBody>


                          <Center>
                            {result}
                          </Center>

                          <div></div>

                          <Center>

                              <Button onClick={closePostSpinModal} px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  CLOSE
                              </Button>
                          </Center>







                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={addGoldModalIsOpen}
                onRequestClose={closeAddGoldModal}
                isCentered
                motionPreset="slideInBottom"
                size="lg"
            >
                <ModalOverlay/>
                <ModalContent  background="brand.sky" fontSize="2xl"
                              boxShadow="0 0 4px #fff, 0 0 11px #fff, 0 0 19px #0F9BF2, 0 0 40px #0F9BF2, 0 0 80px #0F9BF2,
                    inset 0 0 4px #fff, inset 0 0 11px #fff, inset 0 0 19px #0F9BF2;"
                              pt={4} pb={6} px={4}>




                    <ModalHeader  fontSize="4xl">OUT OF TOKENS!</ModalHeader>
                    <ModalBody >

                        <Text fontSize="2xl" color="black.500">
                            You're all out of tokens...
                        </Text>

                        <Text fontSize="2xl" color="black.500">
                            Check out these ways to get some more and continue playing!
                        </Text>

                        <Flex direction="row" justify="center" mt={4}>
                          <Link as={ReactLink} to="/refill">
                              <Button px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  Free Refills
                              </Button>
                          </Link>
                          <Link as={ReactLink} to="/referral">
                              <Button px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  Referrals
                              </Button>
                          </Link>
                          <Link as={ReactLink} to="/crew">
                              <Button px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  Crew
                              </Button>
                          </Link>
                          <Link as={ReactLink} to="/offers">
                              <Button px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  Offers
                              </Button>
                          </Link>

                        </Flex>


                        <Center>

                            <Button mt={4} onClick={closeAddGoldModal} px={8} borderRadius="0px"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                CLOSE
                            </Button>
                        </Center>

                    </ModalBody>


                </ModalContent>
            </Modal>
              <a
              href={toastAd.href}
              target="_blank"
              >
                  <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    limit={1}
                    closeOnClick
                    rtl={false}
                    draggable
                    >
                </ToastContainer>
              </a>




        </Box>
    );
}
