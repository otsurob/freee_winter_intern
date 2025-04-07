import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Flex align="center" justify="center" h="100vh">
      <VStack colorPalette="teal">
        <Spinner color="colorPalette.600" />
        <Text color="colorPalette.600">Loading...</Text>
        <Text color="colorPalette.600">表示には時間がかかる場合があります</Text>
      </VStack>
    </Flex>
  );
};

export default Loading;
