import React, { useState } from "react";
import "./index.css";

export function OptGroup({ children, title }) {
  return <div>{title}</div>;
}

export function Option({ onClick, children, value, inputValue, className }) {
  return (
    <div className={`${className} option`} onClick={onClick} value={value}>
      {children}
    </div>
  );
}

export function AutoComplete({
                               dataSource,
                               children,
                               onSearch,
                               onSelect,
                               placeholder,
                               autoFocus = false,
                               disabled = false,
                               filterOption,
                               defaultValue = "",
                               defaultOpen = false,
                               onDropdownVisibleChange,
                               onChange,
                               onBlur,
                               onFocus
                             }) {
  const [show, setShow] = useState(defaultOpen);
  const [inputValue, setInputValue] = useState(defaultValue);

  function showStatusHandler(bool) {
    onDropdownVisibleChange && onDropdownVisibleChange(bool);
    setShow(bool);
  }

  function wrapperWithOption(child) {
    // array of Element
    const value = child.type ? child.props.value : child;
    if (checkMatch(value)) {
      return React.cloneElement(<Option />, {
        onClick: () => {
          onSelectHandler(child.type ? child.props.value : child);
        },
        value,
        inputValue,
        className: inputValue && inputValue === value ? "last-time-select" : "",
        children: child
      });
    } else {
      return null;
    }
  }

  function checkMatch(optionItemValue) {
    if (filterOption) {
      return !!filterOption(String(inputValue), String(optionItemValue));
    } else {
      return String(optionItemValue).match(String(inputValue));
    }
  }

  function afterFilterList() {
    // 判断。
    if (dataSource && dataSource.length) {
      return React.Children.map(dataSource, (child, index) => {
        if (child.type === OptGroup) {
          const arr = React.Children.map(
            child.props.children,
            wrapperWithOption
          );
          return arr ? (
            <>
              {React.cloneElement(child, { children: null })}
              {arr}
            </>
          ) : null;
        } else {
          return wrapperWithOption(child);
        }
      });
    } else {
      return null;
    }
  }

  function onSelectHandler(item) {
    setInputValue(item);
    onSelect && onSelect(item);
    onChange && onChange(item);
  }

  function onChangeHandler(e) {
    const { value } = e.target;
    setInputValue(value);
    onSearch && onSearch(value);
    onChange && onChange(value);
  }
  const defaultInputJsx = (
    <input
      className={disabled ? "input-disabled" : ""}
      autoFocus={autoFocus}
      disabled={disabled}
      value={inputValue}
      onFocus={() => {
        showStatusHandler(true);
        onFocus && onFocus();
      }}
      onBlur={() => {
        onBlur && onBlur();
        window.setTimeout(() => {
          showStatusHandler(false);
        }, 300);
      }}
      onChange={onChangeHandler}
      placeholder={placeholder}
    />
  );

  function replaceInput(child) {
    let dom = child;
    if (child.type === "input") {
      dom = defaultInputJsx;
    } else if (child.props && child.props.children) {
      dom = React.Children.map(child.props.children, replaceInput);
    }
    return dom;
  }

  function renderInput() {
    let dom = children;
    // 如果自定义了input
    if (dom) {
      dom = replaceInput(React.cloneElement(children));
    } else {
      dom = defaultInputJsx;
    }
    return dom;
  }
  return (
    <div>
      {renderInput()}
      {show && afterFilterList()}
    </div>
  );
}
