import { useTranslation } from "react-i18next";

const T = () => {
  const { t } = useTranslation();

  return {
    welcome: t("welcome"),
    sadvibe: t("sadvibe"),
    vi: t("vi"),
    en: t("en"),
    jp: t("jp"),
    kr: t("kr"),
    play: t("play"),
    pause: t("pause"),
    playing_state: t("playing_state"),
    paused_state: t("paused_state"),
    playlist: t("playlist"),
    loop_feature: t("loop_feature"),
    shuffle_feature: t("shuffle_feature"),
    discussion_feature: t("discussion_feature"),
    setting: t("setting"),
    back: t("back"),
    search: t("search"),
    language: t("language"),
    theme: t("theme"),
    backdrop: t("backdrop"),
    equalizer: t("equalizer"),
    request_song: t("request_song"),
    solid: t("solid"),
    random_image: t("random_image"),
    blur_image: t("blur_image"),
    result: t("result"),
    not_update_lyrics: t("not_update_lyrics"),
    list_empty: t("list_empty"),
    loading: t("loading"),
    error_page: t("error_page"),
    reload: t("reload"),
  };
};

export default T;
