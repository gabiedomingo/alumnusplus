import { FiEdit2, FiGithub, FiMail } from "react-icons/fi";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useFeed, useUserFeed } from "../../lib/globalStates";

import { AnimatePresence } from "framer-motion";
import MeConnections from "../../components/MeConnections";
import MeFeed from "../../components/MeFeed";
import MeSettings from "../../components/MeSettings";
import { __PageTransition } from "../../lib/animtions";
import __supabase from "../../lib/supabase";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const MePage = (e) => {
  const [tabActive, setTabActive] = useState("feed");
  const [localUser, setLocalUser] = useState();
  const [localConnections, setLocalConnections] = useState([]);
  const [localFeed, setLocalFeed] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    const connections =
      (await __supabase.auth.user().user_metadata.connections) || [];
    const user = await __supabase.auth.user();
    const { data, error } = await __supabase
      .from("hunt_blog")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("uploader_email", user.email);

    if (error) {
      toast.error(error.message);
    } else {
      setLocalConnections(connections);
      setLocalFeed(data);
    }
  };

  const checkUser = async () => {
    const user = __supabase.auth.user();
    if (!user) {
      router.push("/");
    } else {
      setLocalUser(user);
      fetchData();
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    localUser && (
      <>
        <motion.main
          variants={__PageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="pb-16 pt-36 lg:pt-24"
        >
          {/* profile */}
          <div className="flex gap-4 items-end relative z-10 py-5 bg-base-100">
            <img
              src={`https://dicebear.com/api/micah/${localUser.user_metadata.username}.svg`}
              className="rounded-full w-24 h-24 lg:w-32 lg:h-32 bg-secondary z-10"
            />

            <div className="flex flex-col gap-2 z-10 ">
              <h1 className="text-2xl lg:text-3xl font-bold leading-3 lg:leading-3">
                {localUser.user_metadata.firstName}{" "}
                {localUser.user_metadata.lastName}
              </h1>
              <p className="opacity-50">@{localUser.user_metadata.username}</p>
            </div>

            <div
              className="hidden lg:inline-block tooltip tooltip-left ml-auto"
              data-tip="Edit profile"
            >
              <div className="btn btn-primary btn-square ml-auto">
                <FiEdit2 />
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="bg-base-100 sticky top-28 pt-5 pb-2">
            <div className="tabs tabs-boxed lg:gap-2 justify-center md:justify-start">
              <a
                onClick={(e) => setTabActive("feed")}
                className={`tab ${tabActive == "feed" && "tab-active"}`}
              >
                My Feed
              </a>
              <a
                onClick={(e) => setTabActive("connections")}
                className={`tab ${tabActive == "connections" && "tab-active"}`}
              >
                My Connections
              </a>
              <a
                onClick={(e) => setTabActive("settings")}
                className={`tab ${tabActive == "settings" && "tab-active"}`}
              >
                Settings
              </a>
            </div>
          </div>

          {/* edz pogi */}
          <div className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                variants={__PageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-5"
                key={tabActive}
              >
                {tabActive == "feed" && <MeFeed feed={localFeed} />}
                {tabActive == "connections" && (
                  <MeConnections connections={localConnections} />
                )}
                {tabActive == "settings" && <MeSettings data={localUser} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </>
    )
  );
};

export default MePage;
