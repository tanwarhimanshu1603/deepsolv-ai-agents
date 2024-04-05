import Navbar from "components/Navbar";
import Head from "next/head";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div>
        <Head>
            <title>Dashboard</title>
        </Head>

        <Navbar isLoggedIn={true} />

        <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
            <div className="max-w-md">
            <h1 className="text-5xl font-bold">DeepSolv Agents</h1>
            <p className="py-6">Unlock the power of AI agents to effortlessly streamline chat completion and task fulfillment, revolutionizing how you engage and conquer your to-do list!</p>
            <div className="space-x-4">
                <Link href='http://34.42.153.11:8000/#form' className="btn bg-orange-400">DeepAgent</Link>
                <Link href='/chat' className="btn">DeepChat</Link>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default AboutPage;
