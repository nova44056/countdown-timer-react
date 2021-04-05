import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import reactLogo from "./images/react_logo.png";

function App() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerStatus, toggleTimerStatus] = useState(false);

  var timer = useRef();
  var totalSec = useRef();

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") alert("Push notification enabled");
        else alert("Push notification disabled");
      });
    }
  }, []);

  const displayNotification = (message) => {
    new Notification("Countdown timer using react", {
      body: message,
    });
  };

  const awayClickHandler = (e) => {
    const bannedElements = {
      content: document.querySelector(".content"),
      app: document.querySelector(".app"),
      header: document.querySelector(".header"),
    };
    const hideTimerSelectDropdownMenu =
      Object.keys(bannedElements).filter(
        (className) => bannedElements[className] === e.target
      ).length > 0;

    const timerSelectWrapper = document.querySelector(".timer-select-wrapper");

    if (hideTimerSelectDropdownMenu) {
      Array.from(timerSelectWrapper.children).forEach((child) => {
        const dropdownMenu = Array.from(child.children).filter((e) =>
          e.classList.contains("dropdown-menu")
        )[0];
        if (dropdownMenu)
          if (dropdownMenu.classList.contains("show"))
            dropdownMenu.classList.remove("show");
      });
    }
  };

  useEffect(() => {
    document.addEventListener("click", awayClickHandler);
    return () => document.removeEventListener("click", awayClickHandler);
  }, []);

  useEffect(() => {
    totalSec.current = hours * 3600 + minutes * 60 + seconds;
  }, [hours, minutes, seconds]);

  // starting and stopping timer changes
  useEffect(() => {
    const resetTimer = () => {
      setHours(0);
      document.getElementById("timer-select-hours-text").innerHTML = 0;
      setMinutes(0);
      document.getElementById("timer-select-minutes-text").innerHTML = 0;
      setSeconds(0);
      document.getElementById("timer-select-seconds-text").innerHTML = 0;
      toggleTimerStatus(false);
    };

    const startTimer = () => {
      timer.current = setInterval(() => {
        totalSec.current--;
        setHours(Math.floor(totalSec.current / 3600) % 24);
        setSeconds(totalSec.current % 60);
        setMinutes(Math.floor(totalSec.current / 60) % 60);
        if (totalSec.current === 0) {
          stopTimer();
        }
      }, 1000);
    };

    const stopTimer = () => {
      if (timer.current) {
        const hours = parseInt(
          document.getElementById("timer-select-hours-text").innerHTML
        );
        const minutes = parseInt(
          document.getElementById("timer-select-minutes-text").innerHTML
        );
        const seconds = parseInt(
          document.getElementById("timer-select-seconds-text").innerHTML
        );
        let message =
          totalSec.current === 0
            ? (hours > 0 ? `${hours} Hours ` : ``) +
              (minutes > 0 ? `${minutes} Minutes ` : ``) +
              (seconds > 0 ? `${seconds} Seconds ` : ``) +
              " have passed !!!!"
            : "Timer has been manually stopped";
        displayNotification(message);
      }
      clearInterval(timer.current);
      timer.current = null;
      resetTimer();
    };

    if (timerStatus) {
      console.log("timer is starting 👍");
      startTimer();
    } else {
      console.log("timer is not running 👎");
      stopTimer();
    }
  }, [timerStatus]);

  const prependZero = (integer) => {
    if (integer < 9) return "0" + integer;
    else return "" + integer;
  };

  const showDropdown = (e) => {
    if (!timerStatus) {
      e.preventDefault();
      // apply onClick event to the correct element
      const dropdown = Array.from(e.currentTarget.children).filter((elm) =>
        elm.classList.contains("dropdown-menu")
      )[0];
      if (dropdown.classList.contains("show"))
        dropdown.classList.remove("show");
      else dropdown.classList.add("show");
    }
  };

  const DropdownMenuOption = (props) => {
    return Array(props.length)
      .fill()
      .map((_, index) => {
        return (
          <span
            onClick={() => {
              props.updateState(index);
              // update option text
              document.getElementById(props.optionID).innerHTML = index;
            }}
            className="dropdown-menu-option noselect"
            key={index}
          >
            {index}
          </span>
        );
      });
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Countdown timer using react</h1>
        <div className="header-logo">
          <img alt="react-logo.png" src={reactLogo} />
        </div>
      </div>
      <div className="content">
        <div className="timer-display-wrapper">
          <span className="timer-display-hours noselect">
            {timerStatus ? prependZero(hours) : "00"}
          </span>
          <span className="timer-display-minutes noselect">
            {timerStatus ? prependZero(minutes) : "00"}
          </span>
          <span className="timer-display-seconds noselect">
            {timerStatus ? prependZero(seconds) : "00"}
          </span>
        </div>

        <div className="timer-select-wrapper">
          <div onClick={showDropdown} className="timer-select-hours">
            <span id="timer-select-hours-text" className="text-m noselect">
              0
            </span>
            <span className="noselect">hours</span>
            {!timerStatus && (
              <i className="fa fa-caret-down" aria-hidden="true" />
            )}
            <div className="dropdown-menu">
              <DropdownMenuOption
                length={24 + 1}
                optionID="timer-select-hours-text"
                updateState={setHours}
              />
            </div>
          </div>
          <div onClick={showDropdown} className="timer-select-minutes">
            <span id="timer-select-minutes-text" className="text-m noselect">
              0
            </span>
            <span className="noselect">minutes</span>
            {!timerStatus && (
              <i className="fa fa-caret-down" aria-hidden="true" />
            )}
            <div className="dropdown-menu">
              <DropdownMenuOption
                length={59 + 1}
                optionID="timer-select-minutes-text"
                updateState={setMinutes}
              />
            </div>
          </div>
          <div onClick={showDropdown} className="timer-select-seconds">
            <span id="timer-select-seconds-text" className="text-m noselect">
              0
            </span>
            <span className="noselect">seconds</span>
            {!timerStatus && (
              <i className="fa fa-caret-down" aria-hidden="true" />
            )}
            <div className="dropdown-menu">
              <DropdownMenuOption
                optionID="timer-select-seconds-text"
                length={59 + 1}
                updateState={setSeconds}
              />
            </div>
          </div>
          {timerStatus ? (
            <div
              className="timer-select-stop"
              onClick={() => toggleTimerStatus(false)}
            >
              <i className="fa fa-stop" aria-hidden="true" />
            </div>
          ) : (
            <div
              className="timer-select-start"
              onClick={() => toggleTimerStatus(!timerStatus)}
            >
              <i className="fa fa-play" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
