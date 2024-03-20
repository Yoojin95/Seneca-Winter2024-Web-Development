import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      {/* Head 컴포넌트를 사용하여 외부 폰트 스타일시트를 추가합니다. */}
      <Head>
        <link href="https://db.onlinewebfonts.com/c/450fdebcd9b47d4e245c0272405e0cf2?family=MarkOT-Medium" rel="stylesheet" type="text/css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
