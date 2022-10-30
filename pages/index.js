import {
  Button,
  Center,
  Container,
  Group,
  Header,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { showNotification } from "@mantine/notifications";
import { MdInfoOutline } from "react-icons/md";
import React, { useState } from "react";

export default function Home() {
  const { copy } = useClipboard();
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
    validate: {
      description: (v) => (v !== "" ? null : "Description is required!"),
      name: (v) => (v !== "" ? null : "Token name is required!"),
      symbol: (v) => (v !== "" ? null : "Symbol is required!"),
      supply: (v) => (v !== "" ? null : "Initial supply is required!"),
      key: (v) => (v !== "" ? null : "Private key is required!"),
    },
  });
  async function createToken() {
    try {
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
          console.log(e.message);
          if (
            e.message.includes(
              "Attempt to debit an account but found no record of a prior credit"
            )
          ) {
            showNotification({
              message: <Text weight={500}>Insuficient credit!</Text>,
              color: "red",
            });
          }
        })
        .finally(() => {
          setIsloading(false);
        }); // submit
    } catch (e) {
      console.log({ e });
      if (e.message.includes("key"))
        showNotification({
          message: <Text weight={500}>Invalid private key!</Text>,
          color: "red",
        });
      setIsloading(false);
    }
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
          <Text size={"xl"}>Contract address:</Text>
          <Text mt={"xs"} size={"xl"}>
            {address}
          </Text>

          <Center>
            <Button
              mt={"xl"}
              color={"indigo"}
              radius={"xl"}
              onClick={() => {
                copy(address);
                showNotification({
                  message: "your token address was copied!",
                  color: "indigo",
                });
              }}
            >
              Copy{" "}
            </Button>
          </Center>
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
            <TextInput
              type={"password"}
              {...form.getInputProps("key")}
              label={
                <Group spacing={"xs"}>
                  <Text>Private Key</Text>
                  <Info />
                </Group>
              }
            />
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

function Info() {
  return (
    <Tooltip
      label="Private key will not enter our database"
      position="top-end"
      withArrow
      transition="pop-bottom-right"
    >
      <Text color="dimmed" sx={{ cursor: "help" }}>
        <Center>
          <MdInfoOutline size={16} stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );
}
