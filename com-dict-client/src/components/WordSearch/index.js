import React, { useState, useEffect } from "react";
import { Typography, Card, Row, Col, Divider, Button, Pagination } from "antd";
import { useFirestore, isLoaded, isEmpty } from "react-redux-firebase";
import WordSimple from "./wordSimple";

const { Title, Text } = Typography;

function WordSearch(props) {
  const firestore = useFirestore();
  const [words, setWords] = useState([]);
  const [trending, setTrending] = useState([]);
  const { keyword } = props;

  useEffect(() => {
    firestore
      .collection("definitions")
      .orderBy("createdAt")
      .where("head_term", "==", keyword)
      .startAfter(new Date().getTime())
      .limit(10)
      .onSnapshot(
        (querySnapshot) => {
          console.log(querySnapshot.docs);
          setWords(
            querySnapshot.docs.map((doc) => {
              return doc.data();
            })
          );
        },
        (err) => {
          console.log(err);
        }
      );

    firestore
      .collection("definitions")
      .orderBy("likes")
      .onSnapshot(
        (querySnapshot) => {
          const defs = querySnapshot.docs.map((doc) => {
            return doc.data();
          });
          setTrending(defs);
        },
        (err) => {
          console.log(err);
        }
      );
  }, []);

  return (
    <>
      <Row>
        <Col lg={4} md={0} sm={0}></Col>
        <Col lg={12} md={24} sm={24} xs={24}>
          {words.length > 0
            ? words.map((val, i) => <WordSimple data={val} />)
            : "Nothing to show here"}
        </Col>
        <Col lg={1} md={0} sm={0}></Col>

        <Col lg={6} md={24} sm={24} xs={24}>
          <Card className="trending">
            <Row justify="space-around">
              <Title level={3}>Trending Words</Title>
            </Row>
            <Row>
              <Divider></Divider>
            </Row>
            <Row>{trending.map((val) => val.other_language_term)}</Row>
          </Card>
        </Col>

        <Col lg={1} md={0} sm={0}></Col>
      </Row>
      <Row style={{ paddingTop: "2vmin" }}>
        <Col lg={4} md={0} sm={0}></Col>
        {/* <Col lg={12} md={24} sm={24} xs={24} style={{ textAlign: "center" }}>
          <Pagination
            defaultCurrent={1}
            total={words && words.length}
            onChange={(page, pageSize) => setPage(page)}
          />
        </Col> */}
        {/* <Col lg={4} md={4} sm={4}></Col> */}
      </Row>
    </>
  );
}

export default WordSearch;
