import ReactDOM from "react-dom";

import { Option, AutoComplete, OptGroup } from "./autoComplete/index";
import React, { useRef, useState, useEffect } from "react";

import {
  combineLatest,
  Observable,
  of,
  pipe,
  concat,
  Subject,
  race,
  merge,
  interval,
  zip
} from "rxjs";
import {
  withLatestFrom,
  delay,
  groupBy,
  map,
  flatMap,
  mergeMap,
  debounceTime,
  switchMap,
  filter,
  partition,
  startWith,
  switchAll
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

// 发送请求，获取搜索结果
function searchQuery(findString) {
  const urlString = "https://api.github.com/users?since=1";
  return of(urlString).pipe(
    flatMap(url => ajax.getJSON(url)),
    map(resultArr => {
      return resultArr.map(item => item.login);
    })
  );
}
// 显示或隐藏警告信息
function toggleWarning() {
  console.log("out of length");
}

function App () {
  const [dataSource, setDataSource] = useState([]);
  const subject = useRef(new Subject());

  // 更新 Input 框中的搜索词（设置新的流）
  function setSearchStr(now) {
    subject.current.next(now);
  }

  // 更新搜索状态
  function setLoading(res) {
    console.log("is searching " + res);
  }

  // 更新搜索结果列表
  function setSearchResults(searchResultArr, searchString) {
    setDataSource(
      searchResultArr && searchResultArr.length
        ? searchResultArr.map((item, index) => (
          <Option value={item}>{renderTag(item, searchString)}</Option>
        ))
        : null
    );
    function renderTag(string, tag) {
      let findIndex = 0;
      let length = 0;
      if (filterOption(tag, string)) {
        console.log(filterOption(tag, string));
        let findIndex = filterOption(tag, string).index;
        let length = tag.length;
        return (
          <>
            <span>{string.slice(0, findIndex)}</span>
            <span style={{ color: "red" }}>
              {string.slice(findIndex, findIndex + length)}
            </span>
            <span>{string.slice(findIndex + length)}</span>
          </>
        );
      } else {
        return null;
      }
    }
  }

  useEffect(() => {
    // 设置流
    subject.current
      .pipe(
        switchMap(inputValue => {
          if (!inputValue || inputValue.length > 30) {
            if (inputValue.length > 30) {
              toggleWarning();
            }
            return of(null);
          } else {
            return of(inputValue).pipe(
              delay(500),
              mergeMap(() => {
                setLoading(inputValue);
                return searchQuery(inputValue);
              }),
              startWith(null)
            );
          }
        }),
        withLatestFrom(subject.current, (searchResultArr, searchString) => [
          searchResultArr,
          searchString
        ])
      )
      .subscribe(([searchResultArr, searchString]) => {
        setSearchResults(searchResultArr, searchString);
      });
  }, []);

  function filterOption(inputValue, itemValue) {
    return itemValue.toUpperCase().match(inputValue.toUpperCase());
  }
  let props = {
    filterOption,
    dataSource,
    onSearch: currentInputValue => {
      setSearchStr(currentInputValue);
    },
    placeholder: "here"
  };
  return (
    <div>
      <AutoComplete {...props}>
        <div>
          <div>enter some letter here-></div>
            <input />
          <div>it will find some github user name</div>
        </div>
      </AutoComplete>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
