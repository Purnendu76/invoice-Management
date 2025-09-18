import { useState, useEffect } from "react";
import {
  Select,
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Grid,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import axios from "axios";
import {
  notifySuccess,
  notifyError,
  notifyWarning,
} from "../lib/utils/notify";
import {usePrefillInvoiceForm} from "../hooks/usePrefillInvoiceForm";

import type { Invoice } from "@/interface/Invoice";

type InvoiceFormProps = {
  onSubmit?: (data: { client: string; amount: number }) => void;
  onClose?: () => void;
  initialValues?: Invoice ;
};

export default function InvoiceForm({
  onSubmit,
  onClose,
  initialValues,
}: InvoiceFormProps) {
  const [loading, setLoading] = useState(false);

  // dropdown options
  const projects = ["NFS", "GAIL", "BGCL", "STP", "Bharat Net", "NFS AMC"];
  const modes = ["Back To Back", "Direct"];
  const states = [
    "West Bengal",
    "Delhi",
    "Bihar",
    "MP",
    "Kerala",
    "Sikkim",
    "Jharkhand",
    "Andaman",
  ];
  const billCategories = [
    "Service",
    "Supply",
    "ROW",
    "AMC",
    "Restoration Service",
    "Restoration Supply",
    "Restoration Row",
    "Spares",
    "Training",
  ];
  const milestones = ["60%", "90%", "100%"];
  const gstOptions = ["5%", "12%", "18%"];
  const statuses = ["Paid", "Cancelled", "Under process", "Credit Note Issued"];

  // state variables
  const [project, setProject] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [billCategory, setBillCategory] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<string | null>(null);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(null);
  const [submissionDate, setSubmissionDate] = useState<Date | null>(null);

  const [basicAmount, setBasicAmount] = useState<number | "">("");
  const [gstPercentage, setGstPercentage] = useState<string | null>(null);

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [passedAmount, setPassedAmount] = useState<number | "">("");
  const [retention, setRetention] = useState<number | "">("");
  const [gstWithheld, setGstWithheld] = useState<number | "">("");
  const [tds, setTds] = useState<number | "">("");
  const [gstTds, setGstTds] = useState<number | "">("");
  const [bocw, setBocw] = useState<number | "">("");
  const [lowDepth, setLowDepth] = useState<number | "">("");
  const [ld, setLd] = useState<number | "">("");
  const [slaPenalty, setSlaPenalty] = useState<number | "">("");
  const [penalty, setPenalty] = useState<number | "">("");
  const [otherDeduction, setOtherDeduction] = useState<number | "">("");

  const [status, setStatus] = useState<string | null>(null);
  const [amountPaid, setAmountPaid] = useState<number | "">("");
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [remarks, setRemarks] = useState("");

  // ✅ hook for prefilling when editing
  usePrefillInvoiceForm({
    initialValues,
    setters: {
      setInvoiceNumber,
      setInvoiceDate,
      setSubmissionDate,
      setBasicAmount,
      setGstPercentage,
      setTotalAmount,
      setPassedAmount,
      setRetention,
      setGstWithheld,
      setTds,
      setGstTds,
      setBocw,
      setLowDepth,
      setLd,
      setSlaPenalty,
      setPenalty,
      setOtherDeduction,
      setStatus,
      setAmountPaid,
      setPaymentDate,
      setRemarks,
      setProject,
      setMode,
      setState,
      setBillCategory,
      setMilestone,
    },
  });

  // derived values
  const gstAmount =
    basicAmount && gstPercentage
      ? (Number(basicAmount) * Number(gstPercentage.replace("%", ""))) / 100
      : 0;

  const totalDeduction =
    Number(retention || 0) +
    Number(tds || 0) +
    Number(gstTds || 0) +
    Number(bocw || 0) +
    Number(lowDepth || 0) +
    Number(ld || 0) +
    Number(slaPenalty || 0) +
    Number(penalty || 0) +
    Number(otherDeduction || 0);

  const netPayable = Number(totalAmount || 0) - totalDeduction;
  const balance = netPayable - Number(amountPaid || 0);

  // ✅ recalculate totalAmount when basicAmount or GST changes
  useEffect(() => {
    setTotalAmount(Number(basicAmount || 0) + gstAmount);
  }, [basicAmount, gstAmount, gstPercentage]);

  // 🔹 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !project ||
      !mode ||
      !state ||
      !billCategory ||
      !invoiceNumber ||
      !invoiceDate ||
      !submissionDate ||
      !basicAmount ||
      !gstPercentage ||
      !status
    ) {
      notifyWarning("Please fill all required fields ❌");
      return;
    }

    if (paymentDate && submissionDate && paymentDate < submissionDate) {
      notifyError("Payment date must be later than Submission Date ❌");
      return;
    }

    const payload = {
      project,
      modeOfProject: mode,
      state,
      mybillCategory: billCategory,
      milestone,
      invoiceNumber,
      invoiceDate: invoiceDate
        ? invoiceDate.toISOString().split("T")[0]
        : null,
      submissionDate: submissionDate
        ? submissionDate.toISOString().split("T")[0]
        : null,
      invoiceBasicAmount: basicAmount || 0,
      gstPercentage,
      invoiceGstAmount: gstAmount,
      totalAmount: totalAmount || 0,
      passedAmountByClient: passedAmount || 0,
      retention: retention || 0,
      gstWithheld: gstWithheld || 0,
      tds: tds || 0,
      gstTds: gstTds || 0,
      bocw: bocw || 0,
      lowDepthDeduction: lowDepth || 0,
      ld: ld || 0,
      slaPenalty: slaPenalty || 0,
      penalty: penalty || 0,
      otherDeduction: otherDeduction || 0,
      totalDeduction,
      netPayable,
      status,
      amountPaidByClient: amountPaid || 0,
      paymentDate: paymentDate
        ? paymentDate.toISOString().split("T")[0]
        : null,
      balance,
      remarks,
    };

    try {
      setLoading(true);

      let res;
      if (initialValues?.id) {
        // 🔹 Update existing invoice
         const token = sessionStorage.getItem("token");
        res = await axios.put(`/api/v1/invoices/${initialValues.id}`, payload,{
          headers: { Authorization: `Bearer ${token}` },
        });
        notifySuccess("Invoice updated successfully ✅");
      } else {
        // 🔹 Create new invoice
          const token = sessionStorage.getItem("token");
        res = await axios.post("/api/v1/invoices", payload,{
          headers: { Authorization: `Bearer ${token}` },
        });
        notifySuccess("Invoice submitted successfully ✅");
      }

      if (onSubmit) {
        onSubmit({ client: billCategory || "Unknown", amount: netPayable });
      }
      if (onClose) onClose();

      console.log(res.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error submitting invoice:",
          error.response?.data || error.message
        );
      } else {
        console.error("Error submitting invoice:", error);
      }
      notifyError("Failed to submit invoice ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={loading}
        loaderProps={{ children: "Submitting..." }}
      />

      <form onSubmit={handleSubmit}>
        <Stack>
          <Grid gutter="md">
            {/* Column 1 */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="sm">
                <Select
                  size="sm"
                  label="Project"
                  data={projects}
                  value={project}
                  onChange={setProject}
                  required
                />
                <Select
                  size="sm"
                  label="Mode of Project"
                  data={modes}
                  value={mode}
                  onChange={setMode}
                  required
                />
                <Select
                  size="sm"
                  label="State"
                  data={states}
                  value={state}
                  onChange={setState}
                  required
                />
                <Select
                  size="sm"
                  label="Bill Category"
                  data={billCategories}
                  value={billCategory}
                  onChange={setBillCategory}
                  required
                />
                <Select
                  size="sm"
                  label="Milestone"
                  data={milestones}
                  value={milestone}
                  onChange={setMilestone}
                />
                <TextInput
                  size="sm"
                  label="Invoice Number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.currentTarget.value)}
                  required
                />
                <DatePickerInput
                  size="sm"
                  label="Invoice Date"
                  value={invoiceDate}
                  onChange={(value) =>
                    setInvoiceDate(value ? new Date(value) : null)
                  }
                  required
                />
                <DatePickerInput
                  size="sm"
                  label="Submission Date"
                  value={submissionDate}
                  onChange={(value) =>
                    setSubmissionDate(value ? new Date(value) : null)
                  }
                  minDate={invoiceDate || undefined}
                  required
                />
                <NumberInput
                  size="sm"
                  label="Invoice Basic Amount"
                  value={basicAmount}
                  onChange={(val) =>
                    setBasicAmount(typeof val === "number" ? val : "")
                  }
                  required
                />
                <Select
                  size="sm"
                  label="GST Percentage Applicable"
                  data={gstOptions}
                  value={gstPercentage}
                  onChange={setGstPercentage}
                  required
                />
                <NumberInput
                  size="sm"
                  label="Invoice GST Amount"
                  value={gstAmount}
                  disabled
                />
                <NumberInput
                  size="sm"
                  label="Total Amount"
                  value={totalAmount}
                  disabled
                />
                <NumberInput
                  size="sm"
                  label="Passed Amount by Client"
                  value={passedAmount}
                  onChange={(val) =>
                    setPassedAmount(typeof val === "number" ? val : "")
                  }
                />
              </Stack>
            </Grid.Col>

            {/* Column 2 */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="sm">
                <NumberInput
                  size="sm"
                  label="Retention"
                  value={retention}
                  onChange={(val) =>
                    setRetention(typeof val === "number" ? val : "")
                  }
                />
                <NumberInput
                  size="sm"
                  label="GST Withheld"
                  value={gstWithheld}
                  onChange={(val) =>
                    setGstWithheld(typeof val === "number" ? val : "")
                  }
                />
                <NumberInput
                  size="sm"
                  label="TDS"
                  value={tds}
                  onChange={(val) => setTds(typeof val === "number" ? val : "")}
                />
                <NumberInput
                  size="sm"
                  label="GST TDS"
                  value={gstTds}
                  onChange={(val) => setGstTds(typeof val === "number" ? val : "")}
                />
                <NumberInput
                  size="sm"
                  label="BOCW"
                  value={bocw}
                  onChange={(val) => setBocw(typeof val === "number" ? val : "")}
                />
                <NumberInput
                  size="sm"
                  label="Low Depth Deduction"
                  value={lowDepth}
                  onChange={(val) =>
                    setLowDepth(typeof val === "number" ? val : "")
                  }
                />
                <NumberInput
                  size="sm"
                  label="LD"
                  value={ld}
                  onChange={(val) => setLd(typeof val === "number" ? val : "")}
                />
                <NumberInput
                  size="sm"
                  label="SLA Penalty"
                  value={slaPenalty}
                  onChange={(val) =>
                    setSlaPenalty(typeof val === "number" ? val : "")
                  }
                />
                <NumberInput
                  size="sm"
                  label="Penalty"
                  value={penalty}
                  onChange={(val) =>
                    setPenalty(typeof val === "number" ? val : "")
                  }
                />
                <NumberInput
                  size="sm"
                  label="Other Deduction"
                  value={otherDeduction}
                  onChange={(val) =>
                    setOtherDeduction(typeof val === "number" ? val : "")
                  }
                />
                <NumberInput
                  size="sm"
                  label="Total Deduction"
                  value={totalDeduction}
                  disabled
                />
                <NumberInput
                  size="sm"
                  label="Net Payable"
                  value={netPayable}
                  disabled
                />
                <Select
                  size="sm"
                  label="Status"
                  data={statuses}
                  value={status}
                  onChange={setStatus}
                  required
                />
                <NumberInput
                  size="sm"
                  label="Amount Paid By Client"
                  value={amountPaid}
                  onChange={(val) =>
                    setAmountPaid(typeof val === "number" ? val : "")
                  }
                />
                <DatePickerInput
                  size="sm"
                  label="Payment Date"
                  value={paymentDate}
                  onChange={(value) =>
                    setPaymentDate(value ? new Date(value) : null)
                  }
                  disabled={status !== "Paid"}
                  minDate={submissionDate || undefined}
                  required
                />
                <NumberInput size="sm" label="Balance" value={balance} disabled />
                <TextInput
                  size="sm"
                  label="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.currentTarget.value)}
                />
              </Stack>
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="md">
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
}
