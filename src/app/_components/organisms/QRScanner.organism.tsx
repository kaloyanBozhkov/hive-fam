"use client";
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
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Stack from "../layouts/Stack.layout";
import Center from "../layouts/Center.layout";
import { Button } from "../shadcn/Button.shadcn";
import { Card, CardContent } from "../shadcn/Card.shadcn";
import { Input } from "../shadcn/Input.shadcn";

const QRScan = ({
  onDecodedQR,
  doneChildren,
  validateDecodedString,
  setOnCloseModalRef,
}: {
  onDecodedQR: (text: string) => void;
  doneChildren: ReactNode;
  validateDecodedString: (str: string) => Promise<boolean>;
  setOnCloseModalRef?: (cb: () => void) => void;
}) => {
  const [step, setStep] = useState<
    "not-yet" | "started" | "in-progress" | "error" | "validating-qr" | "done"
  >("not-yet");
  const [file, setFile] = useState<File | null>(null);
  const [decodedQR, setDecodedQR] = useState<string | null>(null);
  const onCancelTakePic = useRef(() => {
    console.log("cancelling");
  });

  const onScanSuccess: QrcodeSuccessCallback = useCallback((decodedText) => {
    setDecodedQR(decodedText);
  }, []);

  const onScanFailure: QrcodeErrorCallback = useCallback((error) => {
    console.warn(`Code scan error = ${error}`);
  }, []);

  const validateDecoded = useCallback(
    (str: string) => {
      setStep("validating-qr");
      validateDecodedString(str)
        .then((success) => {
          if (success) setDecodedQR(str);
          else setStep("error");
        })
        .catch(() => {
          console.log("failed to vlaidate qr");
          setStep("error");
        });
    },
    [validateDecodedString],
  );

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
      .then(() => setStep("started"))
      .catch(() => {
        console.log("failed to start qr scanner");
      });

    onCancelTakePic.current = () => {
      if (qrScanner.isScanning)
        qrScanner
          .stop()
          .then(() => console.log("stopped"))
          .catch(() => console.log("failed to stop qr scanner"));
    };

    setOnCloseModalRef?.(onCancelTakePic.current);

    // Cleanup function
    return () => {
      if (qrScanner.isScanning) {
        qrScanner
          .stop()
          .then(() => console.log("stopped"))
          .catch(() => console.log("failed to stop qr scanner"));
      }
    };
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

    return () => {
      onCancelTakePic.current();
    };
  }, [file, validateDecoded]);

  useEffect(() => {
    if (decodedQR) {
      setStep("done");
      onDecodedQR(decodedQR);
      onCancelTakePic.current();
      if (file) setFile(null);
    }
  }, [decodedQR, file, onDecodedQR]);

  if (step === "not-yet") {
    return (
      <Stack className="gap-4">
        <div id="420file69" className="hidden" />
        <Stack className="items-center gap-2">
          <Button
            className="w-full sm:w-fit"
            onClick={() => setStep("in-progress")}
          >
            <FontAwesomeIcon icon={faCamera} className="mr-2" />
            Take Picture
          </Button>
        </Stack>
        <Center>
          <p className="font-bold">- OR -</p>
        </Center>
        <Card>
          <CardContent className="p-6">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setFile(e.target.files[0]!)}
              className="w-full"
            />
          </CardContent>
        </Card>
      </Stack>
    );
  }

  if (step === "error") {
    return (
      <Stack className="gap-6">
        <Center>
          <Card className="w-full">
            <CardContent className="w-full p-6">
              <h3 className="text-lg font-semibold">QR Code Not Detected</h3>
              <p className="w-full text-sm text-muted-foreground">
                The QR code couldn&apos;t be read.
                <br />
                Please try again.
              </p>
            </CardContent>
          </Card>
        </Center>
        <Center>
          <Button
            className="w-full sm:w-fit"
            onClick={() => setStep("not-yet")}
            variant="default"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Try Again
          </Button>
        </Center>
      </Stack>
    );
  }

  if (step === "done") {
    return <>{doneChildren}</>;
  }

  if (step === "validating-qr") {
    return (
      <Center className="min-h-[220px]">
        <p>Validating QR Code...</p>
      </Center>
    );
  }

  return (
    <Stack className="gap-4">
      <p className="text-lg">Scan a QR Code to validate the ticket.</p>
      <Stack className="gap-2">
        <div className="relative min-h-[220px]">
          <div id="420cam69" />
          {step === "in-progress" && (
            <Center className="absolute inset-0">
              <p>Starting camera...</p>
            </Center>
          )}
        </div>
        {step === "started" && (
          <>
            <p className="text-center text-sm text-muted-foreground">
              Center the QR Code in the camera view.
            </p>
            <Stack className="items-center gap-4">
              <div className="relative flex w-4/5 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 flex-shrink text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <Button
                variant="default"
                onClick={() => {
                  setStep("not-yet");
                  onCancelTakePic.current();
                }}
                className="w-full sm:w-fit"
              >
                <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
                Abort Scan
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default QRScan;

const VIDEO_CONSTRAINTS = { facingMode: "environment" };
