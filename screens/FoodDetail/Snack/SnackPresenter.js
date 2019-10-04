import React from "react";
import { Text, Platform } from "react-native";
import styled from "styled-components";
import propType from "prop-types";
import { withNavigation } from "react-navigation";

const Container = styled.View``;

const Btn = styled.TouchableOpacity`
    width:30px;
    height:30px;
    background-color:red;
`;
const SnackPresenter = ({navigation}) =>
<Container>
    <Text>간식</Text>
    <Btn onPress={()=>navigation.navigate("SearchScreen")}/>

</Container> 

export default withNavigation(SnackPresenter);