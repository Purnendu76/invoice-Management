import { useState } from "react";
import {
  Select,
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Grid,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

export default function InvoiceForm() {
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
  const gstOptions = ["5", "12", "18", "28"];
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

  // derived values
  const gstAmount =
    basicAmount && gstPercentage
      ? (Number(basicAmount) * Number(gstPercentage)) / 100
      : 0;
  const totalAmount = Number(basicAmount || 0) + gstAmount;

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

  const netPayable = totalAmount - totalDeduction;
  const balance = netPayable - Number(amountPaid || 0);

  return (
    <form>
      <Stack>
        <Grid gutter="md">
          {/* Column 1 */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm" >
              <Select  size="sm" label="Project" data={projects} value={project} onChange={setProject} />
              <Select size="sm" label="Mode of Project" data={modes} value={mode} onChange={setMode} />
              <Select size="sm" label="State" data={states} value={state} onChange={setState} />
              <Select size="sm" label="Bill Category" data={billCategories} value={billCategory} onChange={setBillCategory} />
              <Select size="sm" label="Milestone" data={milestones} value={milestone} onChange={setMilestone} />

              <TextInput size="sm" label="Invoice Number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.currentTarget.value)} />

              <DatePickerInput size="sm" label="Invoice Date" value={invoiceDate} onChange={(value) => setInvoiceDate(value ? new Date(value) : null)} />
              <DatePickerInput
                size="sm"
                label="Submission Date"
                value={submissionDate}
                onChange={(value) => setSubmissionDate(value ? new Date(value) : null)}
                minDate={invoiceDate || undefined}
              />

              <NumberInput size="sm" label="Invoice Basic Amount" value={basicAmount} onChange={(val) => setBasicAmount(typeof val === "number" ? val : "")} />
              <Select size="sm" label="GST Percentage Applicable" data={gstOptions} value={gstPercentage} onChange={setGstPercentage} />
              <NumberInput size="sm" label="Invoice GST Amount" value={gstAmount} disabled />
              <NumberInput size="sm" label="Total Amount" value={totalAmount} disabled />
              <NumberInput size="sm" label="Passed Amount by Client" value={passedAmount} onChange={(val) => setPassedAmount(typeof val === "number" ? val : "")} />
            </Stack>
          </Grid.Col>

          {/* Column 2 */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <NumberInput size="sm" label="Retention" value={retention} onChange={(val) => setRetention(typeof val === "number" ? val : "")} />
              <NumberInput size="sm" label="GST Withheld" value={gstWithheld} onChange={(val) => setGstWithheld(typeof val === "number" ? val : "")} />
              <NumberInput size="sm" label="TDS" value={tds} onChange={(val) => setTds(typeof val === "number" ? val : "")} />
              <NumberInput size="sm" label="GST TDS" value={gstTds} onChange={(val) => setGstTds(typeof val === "number" ? val : "")} />
              <NumberInput size="sm" label="BOCW" value={bocw} onChange={(val) => setBocw(typeof val === "number" ? val : "")} />
              <NumberInput size="sm" label="Low Depth Deduction" value={lowDepth} onChange={(val) => setLowDepth(typeof val === "number" ? val : "")} />
              <NumberInput size="sm" label="LD" value={ld} onChange={(val) => setLd(typeof val === "number" ? val : "")} />
              <NumberInput size="sm" label="SLA Penalty" value={slaPenalty} onChange={(val) => setSlaPenalty(typeof val === "number" ? val : "")} />
              <NumberInput size="sm" label="Penalty" value={penalty} onChange={(val) => setPenalty(typeof val === "number" ? val : "")} />
              <NumberInput size="sm" label="Other Deduction" value={otherDeduction} onChange={(val) => setOtherDeduction(typeof val === "number" ? val : "")} />

              <NumberInput size="sm" label="Total Deduction" value={totalDeduction} disabled />
              <NumberInput size="sm" label="Net Payable" value={netPayable} disabled />

              <Select size="sm" label="Status" data={statuses} value={status} onChange={setStatus} />
              <NumberInput size="sm" label="Amount Paid By Client" value={amountPaid} onChange={(val) => setAmountPaid(typeof val === "number" ? val : "")} />
              <DatePickerInput
                size="sm"
                label="Payment Date"
                value={paymentDate}
                onChange={(value) => setPaymentDate(value ? new Date(value) : null)}
                minDate={submissionDate || undefined}
                disabled={status !== "Paid"}
              />
              <NumberInput size="sm" label="Balance" value={balance} disabled />
              <TextInput size="sm" label="Remarks" value={remarks} onChange={(e) => setRemarks(e.currentTarget.value)} />
            </Stack>
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
          <Button size="sm" type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
}
