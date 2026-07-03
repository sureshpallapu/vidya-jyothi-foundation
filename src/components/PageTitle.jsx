import { useEffect } from "react";

function PageTitle({ title }) {
  useEffect(() => {
    document.title = `${title} | Vidya Jyothi Foundation`;
  }, [title]);

  return null;
}

export default PageTitle;