import {
	Button,
	Input,
	InputWrapper,
	Modal,
	useMantineTheme,
} from "@mantine/core";
import Head from "next/head";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";

export default function Home() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		setError,
	} = useForm();
	const [modalOpened, setModalOpened] = useState(false);
	const [resultUrl, setResultUrl] = useState("");
	const theme = useMantineTheme();

	const onSubmit = async (data) => {
		clearErrors();
		try {
			const resp = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/url`,
				data
			);
			setResultUrl(resp.data.data.shortenedUrl);
			setModalOpened(true);
		} catch {
			setError("name", { message: "URL with given name already exists" });
		}
	};

	return (
		<div className="main">
			<Head>
				<title>URL Shortener</title>
				<meta
					name="description"
					content="URL Shortener for the modern era"
				/>
				<link
					rel="icon"
					href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/304/pinching-hand_1f90f.png"
				/>
			</Head>
			<Modal
				transition="pop"
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				title="Your shortened url!"
				overlayOpacity={0.5}
				overlayColor={theme.colors.gray[2]}
			>
				<div className="modal__container">
					<h2>Here is your url:</h2>
					<a href={resultUrl} target="_blank" rel="noreferrer">
						{resultUrl}
					</a>
				</div>
			</Modal>

			<main className="form__container">
				<div className="form__wrapper">
					<h1 className="form__header">Shorten your URL</h1>
					<form className="form" onSubmit={handleSubmit(onSubmit)}>
						<div className="form__inputs">
							<InputWrapper label="Enter url">
								<Input
									size="md"
									variant="filled"
									placeholder="Your url"
									{...register("url", {
										required: "This field is required",
										maxLength: {
											value: 255,
											message: "Your url is too long",
										},
									})}
								/>
								<ErrorMessage
									errors={errors}
									name="url"
									render={({ message }) => (
										<p className="form__error">{message}</p>
									)}
								/>
							</InputWrapper>
							<InputWrapper label="Enter name (optional)">
								<Input
									variant="filled"
									size="md"
									placeholder="Short name"
									{...register("name")}
								/>
								<ErrorMessage
									errors={errors}
									name="name"
									render={({ message }) => (
										<p className="form__error">{message}</p>
									)}
								/>
							</InputWrapper>
						</div>
						<Button
							type="submit"
							size="md"
							variant="gradient"
							gradient={{ from: "grape", to: "pink", deg: 35 }}
							className="form__button"
						>
							Shorten!
						</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
