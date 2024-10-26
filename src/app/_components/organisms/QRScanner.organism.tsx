import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Html5Qrcode } from "html5-qrcode";
import type {
  QrcodeErrorCallback,
  QrcodeSuccessCallback,
} from "html5-qrcode/esm/core";

import {
  faArrowLeft,
  faCamera,
  faFile,
  faFileCircleCheck,
  faFileCircleExclamation,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const QRScan = ({
  onDecodedQR,
  doneChildren,
  validateDecodedString,
  setOnCloseModalRef,
}: {
  onDecodedQR: (text: string) => void;
  doneChildren: ReactNode;
  validateDecodedString: (str: string) => Promise<boolean>;
  // allow cleanup when component is not unmounted but hidden by parent
  setOnCloseModalRef: (cb: () => void) => void;
}) => {
  const [step, setStep] = useState<
      "not-yet" | "started" | "in-progress" | "error" | "validating-qr" | "done"
    >("not-yet"),
    onScanSuccess: QrcodeSuccessCallback = useCallback((decodedText) => {
      //   console.log(`Code matched = ${decodedText}`, decodedResult)
      setDecodedQR(decodedText);
    }, []),
    onScanFailure: QrcodeErrorCallback = useCallback((error) => {
      console.warn(`Code scan error = ${error}`);
    }, []),
    [decodedQR, setDecodedQR] = useState<string | null>(null),
    validateDecoded = useCallback(
      (str: string) => {
        setStep("validating-qr");
        validateDecodedString(str).then((success) => {
          if (success) setDecodedQR(str);
          else setStep("error");
        });
      },
      [setDecodedQR, validateDecodedString],
    ),
    onCancelTakePic = useRef(() => {});

  useEffect(() => {
    if (step !== "in-progress") return;
    const qrScanner = new Html5Qrcode("420cam69");

    qrScanner
      .start(
        VIDEO_CONSTRAINTS,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanFailure,
      )
      .then(() => setStep("started"));

    onCancelTakePic.current = () => {
      if (qrScanner.isScanning) qrScanner.stop();
    };

    // allow cleanup when component is not unmounted but hidden by parent
    setOnCloseModalRef(onCancelTakePic.current);
  }, [step, onScanFailure, onScanSuccess, setOnCloseModalRef]);

  useEffect(() => {
    if (!file) return;
    const qrScanner = new Html5Qrcode("420file69");

    qrScanner
      .scanFile(file, true)
      .then((decodedText) => validateDecoded(decodedText))
      .catch((err) => {
        console.log(`Error scanning file. Reason: ${err}`);
        setStep("error");
        setFile(null);
      });
  }, [file, validateDecoded]);

  useEffect(() => {
    if (decodedQR) {
      setStep("done");
      onDecodedQR(decodedQR);
      onCancelTakePic.current();
      if (file) setFile(null);
    }
  }, [decodedQR, file, onDecodedQR]);

  let content: ReactNode = null;

  const info = (
    <Text size="sm">
      You can scan the <b>QR Code</b> of an AI-Caramba T-Shirt and claim
      ownership to the Artwork.
    </Text>
  );

  if (step === "not-yet") {
    content = (
      <>
        {info}
        {/* qr code scanner requires an html element to preview scan to */}
        <div id="420file69" style={{ display: "none" }} />
        <Dropzone
          onDrop={(files) => setFile(files[0])}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          maxFiles={1}
          className={styles.dropZone}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Stack>
              <Dropzone.Accept>
                <FontAwesomeIcon icon={faFileCircleCheck} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <FontAwesomeIcon icon={faFileCircleExclamation} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <FontAwesomeIcon icon={faFile} />
              </Dropzone.Idle>
              <Text size="xl" inline>
                Drag your QR Code image here or click to select a file
                <Text size="sm" color="dimmed" inline mt={7}>
                  Attach an image <b>(.png, .jpg or .jpeg)</b> file of your QR
                  code, should not exceed 5mb
                </Text>
              </Text>
            </Stack>
          </Group>
        </Dropzone>
        <Center>
          <Text size="sm" weight="bold">
            - OR -
          </Text>
        </Center>
        <Stack align="center" spacing="xs">
          <Text color="dimmed" size="sm">
            Use the webcam on your device to take a picture of the QR Code.
          </Text>
          <ActionButton
            label="Take Picture"
            modifier="primary"
            leftFontAwesomeIcon={faCamera}
            onClick={() => setStep("in-progress")}
            px="xl"
          />
        </Stack>
      </>
    );
  } else if (step === "error") {
    content = (
      <Stack spacing="xl">
        <Center>
          <Issue withoutButton>
            <Title
              title="We could not detect a valid QR Code :("
              subtitle="Oops!"
              size="xs"
            />
            <p style={{ maxWidth: "50rem" }}>
              Maybe the file you provided was the wrong one, or perhaps the QR
              Code is not visible or well centered. You can go back and try
              again.
            </p>
          </Issue>
        </Center>
        <Center>
          <ActionButton
            label="Go Back & Try Again"
            modifier="secondary"
            leftFontAwesomeIcon={faArrowLeft}
            onClick={() => setStep("not-yet")}
            px="xl"
          />
        </Center>
      </Stack>
    );
  } else if (step === "done") {
    content = doneChildren;
  } else if (step === "validating-qr") {
    content = (
      <Center style={{ minHeight: 220 }}>
        <Loading message="Validating QR Code..." />
      </Center>
    );
  } else {
    content = (
      <>
        {info}
        <Stack spacing="xs">
          <Box pos="relative" style={{ minHeight: 220 }}>
            <div id="420cam69" />
            {step === "in-progress" && (
              <Center pos="absolute" top={0} bottom={0} left={0} right={0}>
                <Loading message="Starting camera..." />
              </Center>
            )}
          </Box>
          {step === "started" && (
            <>
              <Text color="dimmed" size="sm" align="center">
                Make sure that the QR Code is visible, preferably also centered.
              </Text>
              <Stack align="center">
                <Divider label="OR" labelPosition="center" my="xs" w="80%" />
                <ActionButton
                  label="Cancel & Go back"
                  modifier="secondary"
                  leftFontAwesomeIcon={faPowerOff}
                  onClick={() => {
                    setStep("not-yet");
                    onCancelTakePic.current();
                  }}
                  px="xl"
                />
              </Stack>
            </>
          )}
        </Stack>
      </>
    );
  }

  return <Stack className={styles.QRScan}>{content}</Stack>;
};

export default QRScan;

const IMAGE_MIME_TYPE = ["image/png", "image/jpg", "image/jpeg"],
  VIDEO_CONSTRAINTS = { facingMode: "environment" };
