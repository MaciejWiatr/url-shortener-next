const NotFoundPage = () => {
	return (
		<div className="notfound__container">
			<img src="/images/notfound.gif" alt="Not found gif" />
			<a href="/">Take me back!</a>
		</div>
	);
};

export default NotFoundPage;

export const getServerSideProps = async ({ res, params }) => {
	const { urlName } = params;
	try {
		const resp = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/url/${urlName}`
		);
		const json = await resp.json();
		const url = json.data?.url;
		if (url) {
			return {
				redirect: {
					permanent: false,
					destination: url,
				},
				props: {},
			};
		}
	} catch (e) {
		res.statusCode = 404;
	}

	return {
		props: {},
	};
};
