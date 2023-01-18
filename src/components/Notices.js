export function HackathonNotice(props) {
  const handleCopy = () => {
    navigator.clipboard.writeText('https://brainstorm.pi/project/63bd8a990f037d47b342dff9');
    alert('Copied');
  }

  return (
    <>
      <div id="hackathonNotice">
        <h2 style={{ marginBottom: '15px' }}>Notice</h2>
        <p>
          Our sister app, Pi eCard, is participating in the{" "}
          <a href="https://minepi.com/hackathon-instructions" target="_blank" rel="noreferrer">
            2023 Pi Network Hackathon
          </a>
          ! <br /><br /> Check out our Brainstorm submission{" "}
          <a onClick={() => window.open("pi://brainstorm.pi/project/63bd8a990f037d47b342dff9")} target="_blank" rel="noreferrer">
            here
          </a>
          , or copy and paste this link into your Pi Browser: <br /> <i onClick={handleCopy}>https://brainstorm.pi/project/63bd8a990f037d47b342dff9</i>
          <br /><br />
          Please show your support with a thumbs up!
        </p>
        <button id="closeHackathonNotice" onClick={props.close}>
          Close
        </button>
      </div>
      <div id='noticeTint' onClick={props.close}></div>
    </>
  );
}