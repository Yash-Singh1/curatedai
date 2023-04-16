import { type NextPage } from "next";
import { Layout } from "~/components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <main className="flex flex-grow flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Curated<span className="text-[hsl(180,100%,70%)]">AI</span>
          </h1>
          <p className="text-2xl text-white text-center">
            AI-powered bookmarking and search engine for personalized productivity.
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
