/*
@author 유현욱
@since 2022.10.28
*/
import * as React from "react";
import { Grid, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect, useRef } from "react";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import BoardItem from "./BoardItem";
import BackMenu from "components/nav/BackMenu";
import { http } from "api/http";
import { useNavigate } from "react-router-dom";
import NavBar from "components/nav/NavBar";
import NoSearchModal from "components/modal/NoSearchModal";
import { Container } from "@mui/system";
import NoCategoryModal from "components/modal/NoCategoryModal copy";

export default function Board() {
  const navigator = useNavigate();

  // 게시판 데이터
  const [boards, setBoards] = useState([
    {
      boardCategory: "질문",
      boardFirstImage: "https://en.pimg.jp/031/716/685/1/31716685.jpg",
      boardId: 0,
      boardTitle: "1번글",
      boardViews: 0,
      commentCount: 0,
      createTime: "2022-10-28T06:37:58.611Z",
      updateTime: "2022-10-28T06:37:58.611Z",
      userId: 0,
      userNickname: "1번유저",
      userProfileImage: "string",
    },
  ]);
  const [category, setCategory] = useState(""); // 카테고리 변수명
  // const [searchKeyWord, setSearchKeyWord] = useState();
  const searchInput = useRef(null); // 검색바 input 객체
  // 카테고리 변경시 할당
  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  // 스크롤링 카운트용
  const [count, setCount] = useState(0)
  // 스크롤링 확인용
  const [loading, setLoading] = useState(false)

  // 스크롤 이벤트 핸들러
const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  
  // 페이지 끝에 도달하면 추가 데이터를 받아온다
  if (scrollTop + clientHeight >= scrollHeight * 0.95  && loading == false) {
    getBoard();
  }
 };

useEffect(() => {
  // scroll event listener 등록
  window.addEventListener("scroll", handleScroll);
  return () => {
    // scroll event listener 해제
    window.removeEventListener("scroll", handleScroll);
  };
  });

  // 전체 게시글 조회 axios
  const getBoard = async () => {
    setLoading(true)
    const response = await http.get(`/boards`, {
      params: {
        page: count,
        size: 5,
      },
    });
    setLoading(false)
    if (response.data.message == "success" && response.data.data.length != 0) {
      if (count == 0) {
        setBoards(response.data.data);
        setCount(count + 1)
      }
      else {
        const fetchedData = response.data.data;
        const mergedData = boards.concat(...fetchedData);
        setBoards(mergedData);
        setCount(count + 1)
      }
    }
  };

  // 전체 게시글 불러오기
  useEffect(() => {
    getBoard();
  }, []);

  async function searchKeyword(e) {
    if (e.key === "Enter") {
      search();
    }
  }

  // 검색 axios
  const search = async () => {
    if (category == '') {
      setOpenNoCategoryModal(true);
    }
    else {
      const response = await http.get(`/boards/search`, {
        params: {
          category: category,
          keyword: searchInput.current.value,
          page: 0,
          size: 20,
        },
      });
      if (response.data.message == "success") {

        if (response.data.data.length == 0) {
          setOpenNoSearchModal(true);
        } else {
          setBoards(response.data.data);
        }
      } else {
        alert("게시글을 불러오지 못했습니다");
      }
    }
  };

  const [openNoSearchModal, setOpenNoSearchModal] = useState(false);
  // 검색결과없음 모달 닫기
  const closeNoSearchModal = () => {
    setOpenNoSearchModal(false);
  };
  
  const [openNoCategoryModal, setOpenNoCategoryModal] = useState(false);
  // 검색결과없음 모달 닫기
  const closeNoCategoryModal = () => {
    setOpenNoCategoryModal(false);
  };

  return (
    <div id="container">
      {/* 상단바 */}
      <BackMenu
        isLeft={true}
        title="커뮤니티"
        type="registKids"
        clickRight={() => {
          navigator("/registBoard");
        }}
      />
      {/* 상단바 끝 */}

      {/* 검색바 영역 */}
      <Container>
        <Grid container justifyContent="space-evenly" alignItems="center">
          <Grid item xs={3}>
            <FormControl
              sx={{
                height: "8vh",
                width: "90%",
                color: "#FFCA28",
                justifyContent: "center",
                textAlign: "center",
              }}
              size="small"
            >
              <Select
                value={category}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={{
                  PaperProps: { sx: { maxHeight: '30vh' } },
                }}
              >
                <MenuItem value={""}>
                  <em>선택</em>
                </MenuItem>
                <MenuItem value={"전체"}>전체</MenuItem>
                <MenuItem value={"자유"}>자유</MenuItem>
                <MenuItem value={"질문"}>질문</MenuItem>
                <MenuItem value={"정보"}>정보</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={8.5}>
            {/* 검색어 입력 부분 */}
            <TextField
              id="standard-search"
              placeholder="검색어를 입력하세요..."
              type="search"
              variant="standard"
              inputRef={searchInput}
              onKeyUp={searchKeyword}
              sx={{ color: "##FFCA28", width: "83%" }}
            />

            {/* 돋보기 버튼 */}
            <IconButton
              type="button"
              sx={{ color: "#FFA000" }}
              aria-label="search"
              onClick={(e) => {
                search(e);
              }}
            >
              <SearchIcon />
            </IconButton>
          </Grid>
          {/* 검색바 끝 */}
        </Grid>
        {/* 게시물 반복문 */}
        <Grid item xs={10} height="25%">
          {boards?.map((store, idx) => {
            return <BoardItem key={idx} item={store} />;
          })}
        </Grid>

        <NavBar />
        <NoSearchModal
          open={openNoSearchModal}
          handleClose={closeNoSearchModal}
        ></NoSearchModal>
        <NoCategoryModal
          open={openNoCategoryModal}
          handleClose={closeNoCategoryModal}
        ></NoCategoryModal>
      </Container>
    </div>
  );
}
