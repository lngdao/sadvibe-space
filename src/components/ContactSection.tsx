import { useState } from "react";
import { Facebook, GitHub, Linkedin } from "react-feather";
import { useStore } from "../store";
import { openInNewTab } from "../utils/funcUtils";
import Tooltip from "./Tooltip";

type TContactType = 'github' | 'linkedin' | 'fb';
type TContactLink = Record<TContactType, { hover: boolean; url: string }>;

const ContactSection = () => {
  const { theme } = useStore((state) => state.setting);
  const [contactIcon, setContactIcon] = useState<TContactLink>({
    github: { hover: false, url: process.env.REACT_APP_GITHUB_LINK! },
    linkedin: { hover: false, url: process.env.REACT_APP_LINKEDIN_LINK! },
    fb: { hover: false, url: process.env.REACT_APP_FB_LINK! },
  });

  const contactIconConfig = {
    size: 20,
    color: theme.value.content,
    cursor: 'pointer',
  };

  return (
    <section
      style={{ display: 'flex', alignItems: 'center', flexFlow: 'column' }}
    >
      <h3 className="copyright">{`v${process.env.REACT_APP_VERSION_APP}@lngdao`}</h3>
      <div
        style={{
          width: '30%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}
      >
        <Tooltip
          text="Github"
          children={
            <GitHub
              {...contactIconConfig}
              fill={
                contactIcon.github.hover
                  ? theme.value.content
                  : theme.value.primary
              }
              onClick={() => openInNewTab(contactIcon.github.url)}
              onMouseEnter={() =>
                setContactIcon((prev) => ({
                  ...prev,
                  github: { ...prev.github, hover: true },
                }))
              }
              onMouseLeave={() =>
                setContactIcon((prev) => ({
                  ...prev,
                  github: { ...prev.github, hover: false },
                }))
              }
            />
          }
        />
        <Tooltip
          text="Linkedin"
          children={
            <Linkedin
              {...contactIconConfig}
              fill={
                contactIcon.linkedin.hover
                  ? theme.value.content
                  : theme.value.primary
              }
              onClick={() => openInNewTab(contactIcon.linkedin.url)}
              onMouseEnter={() =>
                setContactIcon((prev) => ({
                  ...prev,
                  linkedin: { ...prev.linkedin, hover: true },
                }))
              }
              onMouseLeave={() =>
                setContactIcon((prev) => ({
                  ...prev,
                  linkedin: { ...prev.linkedin, hover: false },
                }))
              }
            />
          }
        />
        <Tooltip
          text="Facebook"
          children={
            <Facebook
              {...contactIconConfig}
              fill={
                contactIcon.fb.hover ? theme.value.content : theme.value.primary
              }
              onClick={() => openInNewTab(contactIcon.fb.url)}
              onMouseEnter={() =>
                setContactIcon((prev) => ({
                  ...prev,
                  fb: { ...prev.fb, hover: true },
                }))
              }
              onMouseLeave={() =>
                setContactIcon((prev) => ({
                  ...prev,
                  fb: { ...prev.fb, hover: false },
                }))
              }
            />
          }
        />
      </div>
    </section>
  );
};

export default ContactSection