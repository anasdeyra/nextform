import {
  Button,
  Center,
  Container,
  Header,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";

import React, { useState } from "react";

export default function Home() {
  const [isLoading, setIsloading] = useState(false);
  const [address, setAddress] = useState("");
  const [opened, { open, close }] = useDisclosure();
  const form = useForm({
    initialValues: {
      symbol: "",
      name: "",
      description: "",
      supply: "",
      key: "",
    },
  });
  async function createToken() {
    setIsloading(true);
    const sdk = ThirdwebSDK.fromPrivateKey("devnet", form.values.key);

    const metadata = {
      symbol: form.values.symbol,
      description: form.values.description,
      name: form.values.name,
      initialSupply: form.values.supply,
    };

    sdk.deployer
      .createToken(metadata)
      .then(async (addy) => {
        console.log(addy);
        console.log("Contract deployed successfully! 🎉");
        setAddress(addy);
        open();
      })
      .catch((e) => {
        console.log("Contract was not deployed");
        console.log(e);
      })
      .finally(() => {
        setIsloading(false);
      }); // submit
  }

  const handleSubmit = form.onSubmit(() => {
    createToken();
  });
  return (
    <>
      {opened && (
        <Modal
          title={"Contract deployed successfully"}
          closeOnClickOutside={false}
          onClose={close}
          opened={opened}
        >
          <Text>Contract address: {address}</Text>
        </Modal>
      )}
      <Header height={96}>
        <Stack sx={{ height: "100%" }} align={"center"} justify="center">
          <Text size={32} weight={700}>
            AscFi
          </Text>
        </Stack>
      </Header>
      <Container mb={196} mt={96} size={"xs"}>
        <Center>
          <Title>Create Token on Solana</Title>
        </Center>
        <Center>
          <Text size={32}>Safe, Fast and Easy!</Text>
        </Center>
        <form onSubmit={handleSubmit}>
          <Stack mt={48}>
            <TextInput
              {...form.getInputProps("symbol")}
              label="Symbol"
              placeholder="Example: SOL"
            />
            <TextInput
              {...form.getInputProps("name")}
              label="Token Name"
              placeholder="Enter token name"
            />
            <TextInput
              {...form.getInputProps("description")}
              label="Description"
              placeholder="Enter your token description"
            />
            <TextInput
              {...form.getInputProps("supply")}
              type={"number"}
              label="Initial Supply"
              placeholder="Example: 10000000"
            />
            <TextInput {...form.getInputProps("key")} label="Private Key" />
            <Button
              loading={isLoading}
              type="submit"
              mt={"xl"}
              radius={"xl"}
              color={"indigo"}
            >
              Create Token
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
}
