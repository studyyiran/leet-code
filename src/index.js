import ReactDOM from 'react-dom';

import { Option, AutoComplete, OptGroup } from './autoComplete/index';
import React, { useRef, useState, useEffect } from 'react';
import './index.css'

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
  zip,
} from 'rxjs';
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
  switchAll,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

// 发送请求，获取搜索结果
function searchQuery(findString) {
  const urlString = 'https://api.github.com/users?since=1';
  return of(urlString).pipe(
    flatMap(url => ajax.getJSON(url)),
    map(resultArr => {
      return resultArr.map(item => item.login);
    })
  );
}
// 显示或隐藏警告信息
function toggleWarning() {
  console.log('out of length');
}

function App() {
  const [dataSource, setDataSource] = useState([]);
  const subject = useRef(new Subject());

  // 更新 Input 框中的搜索词（设置新的流）
  function setSearchStr(now) {
    subject.current.next(now);
  }

  // 更新搜索状态
  function setLoading(res) {
    console.log('is searching ' + res);
  }

  // 更新搜索结果列表
  function setSearchResults(searchResultArr, searchString) {
    setDataSource(
      searchResultArr && searchResultArr.length
        ? searchResultArr.map((item, index) => <Option value={item}>{item}</Option>)
        : null
    );
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
          searchString,
        ])
      )
      .subscribe(([searchResultArr, searchString]) => {
        setSearchResults(searchResultArr, searchString);
      });
  }, []);

  function filterOption(inputValue, itemValue) {
    return itemValue.toUpperCase().match(inputValue.toUpperCase());
  }
  const configArr = {};
  let props = {};
  function renderPart1() {
    return (
      <div>
        1.基本使用。通过 dataSource 设置自动完成的数据源
        <AutoComplete
          dataSource={dataSource}
          onSearch={value => {
            setDataSource([value, value + value, value + value + value]);
          }}
          placeholder={'here'}
        />
      </div>
    );
  }
  function renderPart2() {
    return (
      <div>
        2.也可以直接传 AutoComplete.Option 作为 AutoComplete 的 children，而非使用 dataSource。
        或者直接传入div。
        <AutoComplete
          dataSource={dataSource}
          onSearch={value => {
            setDataSource(
              [value, value + value, value + value + value].map(value => {
                return (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }} value={value}>
                    <div>value</div>
                    <img src={require('./favicon.ico')} />
                  </div>
                );
              })
            );
          }}
          placeholder={'here'}
        />
      </div>
    );
  }
  function renderPart3() {
    return (
      <div>
        3.自定义输入组件。
        <AutoComplete
          dataSource={dataSource}
          onSearch={value => {
            setDataSource([value, value + value, value + value + value]);
          }}
          placeholder={'here'}
        >
          <div>
            <input />
          </div>
        </AutoComplete>
      </div>
    );
  }
  function renderPart4() {
    return (
      <div>
        4.不区分大小写的 AutoComplete
        <AutoComplete
          filterOption={filterOption}
          dataSource={dataSource}
          onSearch={currentInputValue => {
            setSearchStr(currentInputValue);
          }}
          placeholder={'type C or c here'}
        >
          <div>
            <input />
          </div>
        </AutoComplete>
      </div>
    );
  }
  function renderPart5() {
    return (
      <div>
        5.查询模式: 确定类目 示例。
        <AutoComplete
          filterOption={filterOption}
          dataSource={[
            <OptGroup
              title={
                <div style={{ width: '300px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>类型1</div>
                  <div>更多</div>
                </div>
              }
            >
              <div value="1">1</div>
              <div value="2">3</div>
              <div value="3">4</div>
            </OptGroup>,
            <OptGroup title={'类型2'}>
              <div value="4">4</div>
              <div value="5">5</div>
              <div value="6">6</div>
            </OptGroup>,
          ]}
          onSearch={currentInputValue => {
            setSearchStr(currentInputValue);
          }}
          placeholder={'here'}
        >
          <div>
            <input />
          </div>
        </AutoComplete>
      </div>
    );
  }
  return (
    <div className="auto-complete-page">
      <div>enter some letter here-></div>
      <div>it will find some github user name</div>
      <div className="components-list">
        {renderPart1()}
        {renderPart2()}
        {renderPart3()}
        {renderPart4()}
        {renderPart5()}
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
