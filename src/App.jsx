import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import DragDropComponent from "./components/DragDropComponent";
import Navbar from "./components/Navbar";
import {
  Download,
  Refresh,
  AutoAwesome,
  Circle,
  PlayArrow,
  DescriptionOutlined,
  ListAltOutlined,
  HistoryOutlined,
  AssuredWorkloadOutlined,
  HomeOutlined,
} from "@mui/icons-material";

import Banamex from "./assets/banamex.png";
import Banbajio from "./assets/banbajio.png";
import BBVA from "./assets/bbva.png";
import Banorte from "./assets/banorte.png";
import Banregio from "./assets/banregio.png";
import BXM from "./assets/bx+.png";
import Chase from "./assets/chase.png";
import HSBC from "./assets/hsbc.png";
import Santander from "./assets/santander.png";
import Scotiabank from "./assets/scotiabank.png";

const BANK_LOGOS = {
  BANAMEX: Banamex,
  BANBAJIO: Banbajio,
  BANORTE: Banorte,
  BANREGIO: Banregio,
  BBVA: BBVA,
  "BX+": BXM,
  CHASE: Chase,
  HSBC: HSBC,
  SANTANDER: Santander,
  SCOTIABANK: Scotiabank,
};

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#FFF",
  backgroundColor: "#1976d2",
  "&:hover": {
    backgroundColor: "#1565C0",
  },
}));

const ColorNextButton = styled(Button)(({ theme }) => ({
  color: "#FFF",
  backgroundColor: "#388E3C",
  "&:hover": {
    backgroundColor: "#2E7D32",
  },
}));

const ColorResetButton = styled(Button)(({ theme }) => ({
  color: "#FFF",
  backgroundColor: "#D32F2F",
  "&:hover": {
    backgroundColor: "#C62828",
  },
  borderColor: "#D32F2F",
}));

const steps = ["Estado de Cuenta", "Auxiliar", "Contexto", "Conciliación"];

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #1976D2 0%, #388E3C 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #388E3C 0%, #2E7D32 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderRadius: 1,
    height: 4,
    border: 0,
    backgroundColor: "#BDBDBD",
  },
}));

const CustomStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#BDBDBD",
  zIndex: 1,
  color: "#fff",
  width: 64,
  height: 64,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",

  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage: "linear-gradient(95deg, #1976D2 0%, #388E3C 100%)",
        boxShadow: "0 4px 10px 0 rgba(25,118,210,.35)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage: "linear-gradient(95deg, #388E3C 0%,  #2E7D32 100%)",
      },
    },
  ],
}));

function StepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <DescriptionOutlined fontSize="large" />,
    2: <ListAltOutlined fontSize="large" />,
    3: <HistoryOutlined fontSize="large" />,
    4: <AssuredWorkloadOutlined fontSize="large" />,
  };

  return (
    <CustomStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </CustomStepIconRoot>
  );
}

StepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeStepAccount, setActiveStepAccount] = useState(0);
  const [activeStepAux, setActiveStepAux] = useState(0);
  const [activeStepContext, setActiveStepContext] = useState(0);
  const [activeStepConciliation, setActiveStepConciliation] = useState(0);
  const [completed, setCompleted] = useState({});
  const [selectedBank, setSelectedBank] = useState("BANAMEX");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAux, setSelectedAux] = useState(null);
  const [extractedAccount, setExtractedAccount] = useState("");
  const [assistantResult, setAssistantResult] = useState("");
  const [auxResult, setAuxResult] = useState("");
  const [compareResult, setCompareResult] = useState("");
  const [selectedPreviousConciliation, setSelectedPreviousConciliation] =
    useState(null);
  const [previousConciliationResult, setPreviousConciliationResult] =
    useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAux, setLoadingAux] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [loadingConciliation, setLoadingConciliation] = useState(false);
  const [stepOne, setStepOne] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepThree, setStepThree] = useState(false);
  const [stepFour, setStepFour] = useState(false);
  const [stepFive, setStepFive] = useState(false);
  const [stepSix, setStepSix] = useState(false);
  const [stepSeven, setStepSeven] = useState(false);
  const [stepEight, setStepEight] = useState(false);
  const [resetAux, setResetAux] = useState(0);
  const [resetAccount, setResetAccount] = useState(0);
  const [resetPrev, setResetPrev] = useState(0);
  const [errorAssistant, setErrorAssistant] = useState(false);
  const [errorAux, setErrorAux] = useState(false);
  const [errorPrev, setErrorPrev] = useState(false);
  const [errorConciliation, setErrorConciliation] = useState(false);
  const [conciliationFileUrl, setConciliationFileUrl] = useState(null);

  const totalSteps = () => {
    return steps.lenght;
  };

  const completedSteps = () => {
    return Object.keys(completed).lenght;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const isStepFailed = (step) => {
    return;
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  const handleAccountChange = (file) => {
    setSelectedAccount(file);
    setStepOne(true);
    setStepTwo(true);
    setActiveStepAccount(2);
  };

  const handleAuxChange = (file) => {
    setSelectedAux(file);
    setStepFour(true);
    setActiveStepAux(1);
  };

  const handlePreviousConciliation = (file) => {
    setSelectedPreviousConciliation(file);
    setStepSix(true);
    setActiveStepContext(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAssistantResult("");
    setAuxResult("");
    setErrorAssistant(false);

    if (!selectedBank) {
      setError("Por favor, selecciona un banco válido.");
      setLoading(false);
      return;
    }

    if (!selectedAccount) {
      setError("Por favor, selecciona un archivo válido");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedAccount);
    formData.append("bank", selectedBank);

    try {
      const extractAccountUrl = "http://localhost:8000/extract_account/";
      const response = await fetch(extractAccountUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar el archivo.");
      }

      const data = await response.json();
      setExtractedAccount(data);

      const executionUrl = "http://localhost:8000/new/";
      const secondResponse = await fetch(executionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!secondResponse.ok) {
        throw new Error(
          "Error al procesar los datos con el asistente inteligente.",
        );
      }

      const result = await secondResponse.json();

      if (result.assistant_transactions) {
        const pdfTransactions = JSON.parse(
          result.assistant_transactions,
        ).transactions;
        setAssistantResult(JSON.stringify(pdfTransactions, null, 2));
        setStepThree(true);
      } else {
        throw new Error("No se encontraron transacciones en la respuesta");
      }
    } catch (error) {
      console.error("Error: ", error);
      setError("Error al procesar el archivo.");
      setErrorAssistant(true);
    } finally {
      setLoading(false);
      setResetAux((prev) => prev + 1);
    }
  };

  const handleSubmitAux = async (e) => {
    e.preventDefault();
    setLoadingAux(true);
    setError(null);
    setAuxResult("");
    setErrorAux(false);
    setPreviousConciliationResult("");

    if (!selectedAux) {
      setError("Por favor, selecciona un archivo válido");
      setLoadingAux(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedAux);

    try {
      const extractAuxUrl = "http://localhost:8000/extract_aux/";
      const response = await fetch(extractAuxUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar el archivo.");
      }

      const data = await response.json();

      if (data.aux_transactions) {
        const csvTransactions = data.aux_transactions;
        setAuxResult(JSON.stringify(csvTransactions, null, 2));
        setStepFive(true);
      } else {
        throw new Error("No se encontraron transacciones");
      }
    } catch (error) {
      console.error("Error: ", error);
      setError("Error al procesar el archivo.");
      setErrorAux(true);
    } finally {
      setLoadingAux(false);
      setResetPrev((prev) => prev + 1);
    }
  };

  const handleSubmitPrevious = async (e) => {
    e.preventDefault();
    setLoadingPrevious(true);
    setError(null);
    setPreviousConciliationResult("");
    setErrorPrev(false);

    if (!selectedPreviousConciliation) {
      setError("Por favor, selecciona un archivo válido");
      setLoadingPrevious(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedPreviousConciliation);

    try {
      const extractPreviousUrl = "http://localhost:8000/extract_previous/";
      const response = await fetch(extractPreviousUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar el archivo.");
      }

      const data = await response.json();

      if (data.previous_transactions) {
        const previousTransactions = data.previous_transactions;
        setPreviousConciliationResult(
          JSON.stringify(previousTransactions, null, 2),
        );
        setStepSeven(true);
      } else {
        throw new Error("No se encontraron transacciones");
      }
    } catch (error) {
      console.error("Error: ", error);
      setError("Error al procesar el archivo.");
      setErrorPrev(true);
    } finally {
      setLoadingPrevious(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoadingConciliation(true);
    setErrorConciliation(false);

    let prevResultParsed;
    let auxResultParsed;
    let assistantResultParsed;

    try {
      prevResultParsed =
        typeof previousConciliationResult === "string"
          ? JSON.parse(previousConciliationResult)
          : previousConciliationResult;
    } catch (e) {
      console.log("Error al parsear");
      setLoadingConciliation(false);
      setErrorConciliation(true);

      return;
    }

    try {
      auxResultParsed =
        typeof auxResult === "string" ? JSON.parse(auxResult) : auxResult;
    } catch (e) {
      console.log("Error al parsear");
      setLoadingConciliation(false);
      setErrorConciliation(true);

      return;
    }

    try {
      assistantResultParsed =
        typeof assistantResult === "string"
          ? JSON.parse(assistantResult)
          : assistantResult;
    } catch (e) {
      console.log("Error al parsear");
      setLoadingConciliation(false);
      setErrorConciliation(true);

      return;
    }

    const data = {
      previousConciliationResult: prevResultParsed,
      auxResult: auxResultParsed,
      assistantResult: assistantResultParsed,
    };

    try {
      const conciliationUrl = "http://localhost:8000/create_conciliation/";
      const response = await fetch(conciliationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al generar el archivo");
      }

      // Convertir la respuesta a Blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      setConciliationFileUrl(url);

      // Crear un enlace para descargar el archivo
      const a = document.createElement("a");
      a.href = url;
      a.download = "CONCILIACION.xlsx"; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setStepEight(true);
    } catch (error) {
      console.error("Error:", error);
      setErrorConciliation(true);
    } finally {
      setLoadingConciliation(false);
    }
  };

  const handleDownload = () => {
    if (!conciliationFileUrl) {
      console.error("No hay archivo para descargar.");
      return;
    }

    const a = document.createElement("a");
    a.href = conciliationFileUrl;
    a.download = "CONCILIACION.xlsx"; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleResetWindow = () => {
    window.location.reload();
  };

  const handleResetConciliation = () => {
    setStepEight(false);
    setErrorConciliation(false);
  };

  const handleResetAccount = () => {
    setAssistantResult(null);
    setSelectedAccount(null);
    setStepOne(false);
    setStepTwo(false);
    setStepThree(false);
    setErrorAssistant(false);
    setResetAccount((prev) => prev + 1);
  };

  const handleResetAux = () => {
    setAuxResult(null);
    setSelectedAux(null);
    setStepFour(false);
    setStepFive(false);
    setErrorAux(false);
    setResetAux((prev) => prev + 1);
  };

  const handleResetPrev = () => {
    setPreviousConciliationResult(null);
    setSelectedPreviousConciliation(null);
    setStepSix(false);
    setStepSeven(false);
    setErrorPrev(false);
    setResetPrev((prev) => prev + 1);
  };

  useEffect(() => {
    console.log("Estado:", {
      selectedPDF: selectedAccount,
      selectedBank,
      resultText: assistantResult,
      selectedExcel: selectedAux,
      excelText: auxResult,
      selectedPrevious: selectedPreviousConciliation,
      previousText: previousConciliationResult,
    });
  }, [
    selectedAccount,
    selectedBank,
    assistantResult,
    selectedAux,
    auxResult,
    selectedPreviousConciliation,
    previousConciliationResult,
  ]);

  return (
    <Box className="h-screen w-full bg-[#F4F5F6]">
      <Navbar />
      <Box sx={{ width: "100%" }}>
        <Stepper
          activeStep={activeStep}
          nonLinear
          alternativeLabel
          sx={{ my: 8 }}
          connector={<CustomConnector />}
        >
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepFailed(index)) {
              labelProps.optional = (
                <Typography fontSize="16px" color="error">
                  Error al procesar
                </Typography>
              );
              labelProps.error = true;
            }
            return (
              <Step key={label} {...stepProps} completed={completed[index]}>
                <StepLabel
                  {...labelProps}
                  StepIconComponent={StepIcon}
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: "28px",
                      mt: 2,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === 0 ? (
          <Box className="grid grid-cols-3 gap-4 m-4">
            <Box className="bg-white rounded-lg">
              <Accordion expanded={true}>
                <AccordionSummary
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box className="flex gap-4 items-center">
                    <Box className="relative">
                      <Circle
                        className={
                          stepOne
                            ? "text-[#388E3C]"
                            : activeStepAccount === 0
                              ? "text-[#1976d2]"
                              : "text-[#BDBDBD]"
                        }
                        fontSize="large"
                      />
                      {!stepOne ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          1
                        </Typography>
                      ) : (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✔
                        </Typography>
                      )}
                    </Box>
                    <Typography fontSize="24px">Estado de cuenta</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box className="flex flex-col gap-4">
                    <DragDropComponent
                      key={resetAccount}
                      onFileSelect={handleAccountChange}
                      mode="pdf"
                    />
                    <Typography
                      fontSize="16px"
                      className="text-black text-center"
                    >
                      Solo se permiten archivos .PDF (máx. 50 MB).
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box className="bg-white rounded-lg">
              <Accordion expanded={true} sx={{ height: "100%" }}>
                <AccordionSummary
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Box className="flex gap-4 items-center">
                    <Box className="relative">
                      <Circle
                        className={
                          stepTwo
                            ? "text-[#388E3C]"
                            : activeStepAccount === 1
                              ? "text-[#1976d2]"
                              : "text-[#BDBDBD]"
                        }
                        fontSize="large"
                      />
                      {!stepTwo ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          2
                        </Typography>
                      ) : (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✔
                        </Typography>
                      )}
                    </Box>
                    <Typography fontSize="24px">Banco</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {activeStepAccount === 2 ? (
                    <Box className="flex flex-col justify-center items-center gap-4 mt-4">
                      <Typography fontSize="20px">
                        Selecciona el banco al que corresponde el estado de
                        cuenta.
                      </Typography>
                      {BANK_LOGOS[selectedBank] && (
                        <Avatar
                          alt={selectedBank}
                          src={BANK_LOGOS[selectedBank]}
                          variant="square"
                          sx={{
                            width: 64,
                            height: 64,
                            "& img": {
                              objectFit: "contain",
                            },
                          }}
                        />
                      )}
                      <form onSubmit={handleSubmit}>
                        <select
                          value={selectedBank}
                          className="p-2 bg-[#EEEEEE] border-4 border-[#1976d2] rounded-md font-bold shadow-sm focus:outline-none focus:ring focus:ring-[#1976d2]"
                          name="options"
                          id="options"
                          onChange={handleBankChange}
                        >
                          <option value="BANAMEX">BANAMEX</option>
                          <option value="BANBAJIO">BANBAJIO</option>
                          <option value="BANORTE">BANORTE</option>
                          <option value="BANREGIO">BANREGIO</option>
                          <option value="BBVA">BBVA</option>
                          <option value="BX+">BX+</option>
                          <option value="CHASE">CHASE</option>
                          <option value="HSBC">HSBC</option>
                          <option value="SANTANDER">SANTANDER</option>
                          <option value="SCOTIABANK">SCOTIABANK</option>
                        </select>
                      </form>
                    </Box>
                  ) : (
                    <Box className="flex flex-col justify-center items-center gap-4 mt-4">
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "24px", width: "75%" }}
                      />
                      <Skeleton variant="circular" width={64} height={64} />
                      <Skeleton variant="rounded" width="20%" height={40} />
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box className="bg-white rounded-lg">
              <Accordion expanded={true} sx={{ height: "100%" }}>
                <AccordionSummary
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Box className="flex gap-4 items-center">
                    <Box className="relative">
                      <Circle
                        className={
                          stepThree && !errorAssistant
                            ? "text-[#388E3C]"
                            : activeStepAccount === 2 && !errorAssistant
                              ? "text-[#1976d2]"
                              : errorAssistant
                                ? "text-[#D32F2F]"
                                : "text-[#BDBDBD]"
                        }
                        fontSize="large"
                      />
                      {!stepThree && !errorAssistant ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          3
                        </Typography>
                      ) : !errorAssistant ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✔
                        </Typography>
                      ) : (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✖
                        </Typography>
                      )}
                    </Box>
                    <Typography fontSize="24px">Extracción</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {loading && (
                    <Box className="relative min-h-32 w-full">
                      <Box className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                        <Box className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1976d2]"></Box>
                      </Box>
                    </Box>
                  )}
                  {activeStepAccount === 2 ? (
                    <>
                      {!stepThree && !errorAssistant && (
                        <Box className="flex justify-center items-center mt-24">
                          <ColorButton
                            variant="contained"
                            disabled={loading ? true : false}
                            onClick={handleSubmit}
                            className="flex gap-2 w-1/2 h-16 text-center"
                          >
                            {loading ? (
                              <Typography fontSize="20px">
                                Cargando...
                              </Typography>
                            ) : (
                              <>
                                <PlayArrow fontSize="large" />
                                <Typography fontSize="20px">Iniciar</Typography>
                              </>
                            )}
                          </ColorButton>
                        </Box>
                      )}
                      {errorAssistant && (
                        <Box className="flex flex-col gap-4 items-center">
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              backgroundColor: "#D32F2F",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: 32,
                                fontWeight: "bold",
                              }}
                            >
                              ✖
                            </Typography>
                          </Box>
                          <Typography fontSize="20px">
                            Error al realizar extracción
                          </Typography>
                          <Typography fontSize="16px">
                            Intenta de nuevo.
                          </Typography>
                          <ColorResetButton
                            variant="outlined"
                            className="flex gap-2"
                            onClick={handleResetAccount}
                          >
                            <Refresh fontSize="large" />
                            <Typography fontSize="20px">
                              Reiniciar proceso
                            </Typography>
                          </ColorResetButton>
                        </Box>
                      )}
                      {stepThree && !errorAssistant && (
                        <Box className="flex flex-col gap-4 items-center text-center">
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              backgroundColor: "#388E3C",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: 32,
                                fontWeight: "bold",
                              }}
                            >
                              ✔
                            </Typography>
                          </Box>
                          <Typography fontSize="20px">
                            Extracción realizada con éxito
                          </Typography>
                          <Typography fontSize="16px">
                            Avanza para continuar con el proceso.
                          </Typography>
                          <ColorNextButton
                            variant="contained"
                            className="flex gap-2 w-1/2 h-12 text-center"
                            onClick={handleComplete}
                          >
                            <Typography fontSize="20px">Continuar</Typography>
                          </ColorNextButton>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box className="flex flex-col justify-center items-center mt-16">
                      <Skeleton variant="rounded" width="50%" height={64} />
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        ) : activeStep === 1 ? (
          <Box className="grid grid-cols-2 gap-4 m-4">
            <Box className="bg-white rounded-lg">
              <Accordion expanded={true} sx={{ height: "100%" }}>
                <AccordionSummary
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box className="flex gap-4 items-center">
                    <Box className="relative">
                      <Circle
                        className={
                          stepFour
                            ? "text-[#388E3C]"
                            : activeStepAux === 0
                              ? "text-[#1976d2]"
                              : "text-[#BDBDBD]"
                        }
                        fontSize="large"
                      />
                      {!stepFour ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          4
                        </Typography>
                      ) : (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✔
                        </Typography>
                      )}
                    </Box>
                    <Typography fontSize="24px">Auxiliar</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box className="flex flex-col p-4 gap-4">
                    <DragDropComponent
                      key={resetAux}
                      onFileSelect={handleAuxChange}
                      mode="excel-csv"
                    />
                    <Typography
                      fontSize="16px"
                      className="text-black text-center"
                    >
                      Solo se permiten archivos .XSLX (máx. 50 MB).
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box className="bg-white rounded-lg">
              <Accordion expanded={true} sx={{ height: "100%" }}>
                <AccordionSummary
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Box className="flex gap-4 items-center">
                    <Box className="relative">
                      <Circle
                        className={
                          stepFive && !errorAux
                            ? "text-[#388E3C]"
                            : activeStepAux === 1 && !errorAux
                              ? "text-[#1976d2]"
                              : errorAux
                                ? "text-[#D32F2F]"
                                : "text-[#BDBDBD]"
                        }
                        fontSize="large"
                      />
                      {!stepFive && !errorAux ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          5
                        </Typography>
                      ) : !errorAux ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✔
                        </Typography>
                      ) : (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✖
                        </Typography>
                      )}
                    </Box>
                    <Typography fontSize="24px">Extracción</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {loadingAux && (
                    <Box className="relative min-h-32 w-full">
                      <Box className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                        <Box className="animate-spin rounded-full h-14 w-14 border-t-4 border-[#1976d2]"></Box>
                      </Box>
                    </Box>
                  )}
                  {activeStepAux === 1 ? (
                    <>
                      {!stepFive && !errorAux && (
                        <Box className="flex justify-center mt-24">
                          <ColorButton
                            variant="contained"
                            disabled={loadingAux ? true : false}
                            onClick={handleSubmitAux}
                            className="flex gap-2 h-16 w-1/2 text-center"
                          >
                            {loadingAux ? (
                              <Typography fontSize="20px">
                                Cargando...
                              </Typography>
                            ) : (
                              <>
                                <PlayArrow fontSize="large" />
                                <Typography fontSize="20px">Iniciar</Typography>
                              </>
                            )}
                          </ColorButton>
                        </Box>
                      )}
                      {errorAux && (
                        <Box className="flex flex-col gap-4 items-center">
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              backgroundColor: "#D32F2F",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: 32,
                                fontWeight: "bold",
                              }}
                            >
                              ✖
                            </Typography>
                          </Box>
                          <Typography fontSize="20px">
                            Error al realizar extracción
                          </Typography>
                          <Typography fontSize="16px">
                            Intenta de nuevo.
                          </Typography>
                          <ColorResetButton
                            variant="outlined"
                            className="flex gap-2"
                            onClick={handleResetAux}
                          >
                            <Refresh fontSize="large" />
                            <Typography fontSize="20px">
                              Reiniciar proceso
                            </Typography>
                          </ColorResetButton>
                        </Box>
                      )}
                      {stepFive && !errorAux && (
                        <Box className="flex flex-col gap-4 items-center text-center">
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              backgroundColor: "#388E3C",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: 32,
                                fontWeight: "bold",
                              }}
                            >
                              ✔
                            </Typography>
                          </Box>
                          <Typography fontSize="20px">
                            Extracción realizada con éxito
                          </Typography>
                          <Typography fontSize="16px">
                            Avanza para continuar con el proceso.
                          </Typography>
                          <ColorNextButton
                            variant="contained"
                            className="flex gap-2 w-1/2 h-12 text-center"
                            onClick={handleComplete}
                          >
                            <Typography fontSize="20px">Continuar</Typography>
                          </ColorNextButton>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box className="flex flex-col justify-center items-center mt-16">
                      <Skeleton variant="rounded" width="50%" height={64} />
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        ) : activeStep === 2 ? (
          <Box className="grid grid-cols-2 flex-1 gap-4 m-4">
            <Box className="bg-white rounded-lg">
              <Accordion expanded={true} sx={{ height: "100%" }}>
                <AccordionSummary
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box className="flex gap-4 items-center">
                    <Box className="relative">
                      <Circle
                        className={
                          stepSix
                            ? "text-[#388E3C]"
                            : activeStepContext === 0
                              ? "text-[#1976d2]"
                              : "text-[#BDBDBD]"
                        }
                        fontSize="large"
                      />
                      {!stepSix ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          6
                        </Typography>
                      ) : (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✔
                        </Typography>
                      )}
                    </Box>
                    <Typography fontSize="24px">Conciliación previa</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box className="flex flex-col p-4 gap-4">
                    <DragDropComponent
                      key={resetPrev}
                      onFileSelect={handlePreviousConciliation}
                      mode="excel-csv"
                    />
                    <Typography
                      fontSize="16px"
                      className="text-black text-center"
                    >
                      Solo se permiten archivos .XSLX (máx. 50 MB).
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box className="bg-white rounded-lg">
              <Accordion expanded={true} sx={{ height: "100%" }}>
                <AccordionSummary
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Box className="flex gap-4 items-center">
                    <Box className="relative">
                      <Circle
                        className={
                          stepSeven && !errorPrev
                            ? "text-[#388E3C]"
                            : activeStepContext === 1 && !errorPrev
                              ? "text-[#1976d2]"
                              : errorPrev
                                ? "text-[#D32F2F]"
                                : "text-[#BDBDBD]"
                        }
                        fontSize="large"
                      />
                      {!stepSeven && !errorPrev ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          7
                        </Typography>
                      ) : !errorPrev ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✔
                        </Typography>
                      ) : (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✖
                        </Typography>
                      )}
                    </Box>
                    <Typography fontSize="24px">Extracción</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {loadingPrevious && (
                    <Box className="relative min-h-32 w-full">
                      <Box className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                        <Box className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1976d2]"></Box>
                      </Box>
                    </Box>
                  )}
                  {activeStepContext === 1 ? (
                    <>
                      {!stepSeven && !errorPrev && (
                        <Box className="flex justify-center mt-24">
                          <ColorButton
                            variant="contained"
                            disabled={loadingPrevious ? true : false}
                            onClick={handleSubmitPrevious}
                            className="flex gap-2 h-16 w-1/2  text-center"
                          >
                            {loadingPrevious ? (
                              <Typography fontSize="20px">
                                Cargando...
                              </Typography>
                            ) : (
                              <>
                                <PlayArrow fontSize="large" />
                                <Typography fontSize="20px">Iniciar</Typography>
                              </>
                            )}
                          </ColorButton>
                        </Box>
                      )}
                      {errorPrev && (
                        <Box className="flex flex-col gap-4 items-center">
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              backgroundColor: "#D32F2F",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: 32,
                                fontWeight: "bold",
                              }}
                            >
                              ✖
                            </Typography>
                          </Box>
                          <Typography fontSize="20px">
                            Error al realizar extracción
                          </Typography>
                          <Typography fontSize="16px">
                            Intenta de nuevo.
                          </Typography>
                          <ColorResetButton
                            variant="outlined"
                            className="flex gap-2"
                            onClick={handleResetPrev}
                          >
                            <Refresh fontSize="large" />
                            <Typography fontSize="20px">
                              Reiniciar proceso
                            </Typography>
                          </ColorResetButton>
                        </Box>
                      )}
                      {stepSeven && !errorPrev && (
                        <Box className="flex flex-col gap-4 items-center text-center">
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              backgroundColor: "#388E3C",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: 32,
                                fontWeight: "bold",
                              }}
                            >
                              ✔
                            </Typography>
                          </Box>
                          <Typography fontSize="20px">
                            Extracción realizada con éxito
                          </Typography>
                          <Typography fontSize="16px">
                            Avanza para terminar con el proceso.
                          </Typography>
                          <ColorNextButton
                            variant="contained"
                            className="flex gap-2 w-1/2 h-12 text-center"
                            onClick={handleComplete}
                          >
                            <Typography fontSize="20px">Continuar</Typography>
                          </ColorNextButton>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box className="flex flex-col justify-center items-center mt-16">
                      <Skeleton variant="rounded" width="50%" height={64} />
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        ) : activeStep === 3 ? (
          <Box className="grid grid-cols-1 gap-4 m-4">
            <Box className="bg-white rounded-lg">
              <Accordion expanded={true} sx={{ height: "100%" }}>
                <AccordionSummary
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Box className="flex gap-4 items-center">
                    <Box className="relative">
                      <Circle
                        className={
                          stepEight && !errorConciliation
                            ? "text-[#388E3C]"
                            : activeStepConciliation === 0 && !errorConciliation
                              ? "text-[#1976d2]"
                              : errorConciliation
                                ? "text-[#D32F2F]"
                                : "text-[#BDBDBD]"
                        }
                        fontSize="large"
                      />
                      {!stepEight && !errorConciliation ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          8
                        </Typography>
                      ) : !errorConciliation ? (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✔
                        </Typography>
                      ) : (
                        <Typography className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                          ✖
                        </Typography>
                      )}
                    </Box>
                    <Typography fontSize="24px">Conciliación actual</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {loadingConciliation && (
                    <Box className="relative min-h-32 w-full">
                      <Box className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                        <Box className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1976d2]"></Box>
                      </Box>
                    </Box>
                  )}
                  <Box className="flex gap-4 justify-center p-4">
                    {!stepEight && !errorConciliation && (
                      <ColorButton
                        variant="contained"
                        disabled={loadingConciliation ? true : false}
                        className="flex gap-2 h-16 w-1/2"
                        onClick={handleVerify}
                      >
                        <AutoAwesome fontSize="large" />
                        <Typography fontSize="20px">Generar</Typography>
                      </ColorButton>
                    )}
                    {errorConciliation && (
                      <Box className="flex flex-col gap-4 items-center">
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            backgroundColor: "#D32F2F",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontSize: 32,
                              fontWeight: "bold",
                            }}
                          >
                            ✖
                          </Typography>
                        </Box>
                        <Typography fontSize="20px">
                          Error al generar conciliación
                        </Typography>
                        <Typography fontSize="16px">
                          Intenta de nuevo.
                        </Typography>
                        <ColorResetButton
                          variant="outlined"
                          className="flex gap-2"
                          onClick={handleResetConciliation}
                        >
                          <Refresh fontSize="large" />
                          <Typography fontSize="20px">
                            Reiniciar proceso
                          </Typography>
                        </ColorResetButton>
                      </Box>
                    )}
                    {stepEight && !errorConciliation && (
                      <Box className="flex flex-col gap-4">
                        <Box className="flex flex-col gap-4 items-center">
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "50%",
                              backgroundColor: "#388E3C",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: 32,
                                fontWeight: "bold",
                              }}
                            >
                              ✔
                            </Typography>
                          </Box>
                          <Typography fontSize="20px">
                            Conciliación realizada con éxito.
                          </Typography>
                        </Box>
                        <Box className="flex gap-4">
                          <ColorButton
                            variant="outlined"
                            className="flex gap-2"
                            onClick={handleResetWindow}
                          >
                            <HomeOutlined fontSize="large" />
                            <Typography fontSize="20px">
                              Volver al inicio
                            </Typography>
                          </ColorButton>
                          <ColorButton
                            variant="contained"
                            className="flex gap-2"
                            onClick={handleDownload}
                          >
                            <Download fontSize="large" />
                            <Typography fontSize="20px">Descargar</Typography>
                          </ColorButton>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}

export default App;
