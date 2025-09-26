import { useEffect, useRef, useState } from "react";
import {
  Table,
  TextInput,
  Group,
  Button,
  Modal,
  Text,
  Badge,
  Stack,
  ActionIcon,
  Loader,
  Title,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import InvoiceForm from "../components/InvoiceForm";
import type { Invoice } from "@/interface/Invoice";
import { modals } from "@mantine/modals";
import { notifySuccess, notifyError } from "../lib/utils/notify";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";


export default function Admin_invoice() {
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [opened, { open, close }] = useDisclosure(false);

  // 👇 NEW for infinite scroll
  const [visibleCount, setVisibleCount] = useState(20);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // ✅ Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const res = await axios.get("/api/v1/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalized = res.data.map((inv: Invoice) => ({
        ...inv,
        invoiceDate: inv.invoiceDate ? new Date(inv.invoiceDate) : null,
        submissionDate: inv.submissionDate ? new Date(inv.submissionDate) : null,
        paymentDate: inv.paymentDate ? new Date(inv.paymentDate) : null,
      }));

      setInvoices(normalized);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ✅ Delete invoice
  const handleDelete = (id: string) => {
    modals.openConfirmModal({
      title: "Delete invoice",
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this invoice?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const token = Cookies.get("token");
          await axios.delete(`/api/v1/invoices/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setInvoices((prev) => prev.filter((inv) => inv.id !== id));
          notifySuccess("Invoice deleted successfully");
        } catch (error) {
          console.error("Error deleting invoice:", error);
          notifyError("Failed to delete invoice. Please try again.");
        }
      },
    });
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    open();
  };

  const handleNew = () => {
    setSelectedInvoice(null);
    open();
  };

  // ✅ Build unique project options for the Select control
  const projectOptions = Array.from(
    new Set(
      invoices.flatMap((inv) =>
        Array.isArray(inv.project) ? inv.project : inv.project ? [inv.project] : []
      )
    )
  ).map((p) => ({ value: p as string, label: p as string }));

  const statusOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Under process", label: "Under process" },
    { value: "Credit Note Issued", label: "Credit Note Issued" },
  ];

  // ✅ Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase());

    const matchesProject =
      !projectFilter ||
      (Array.isArray(inv.project)
        ? inv.project.some((p) => p.toLowerCase() === projectFilter.toLowerCase())
        : inv.project?.toLowerCase() === projectFilter.toLowerCase());

    const matchesStatus =
      !statusFilter || inv.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesProject && matchesStatus;
  });

  // ✅ Infinite scroll effect
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 20); // load next 20
      }
    });

    observer.observe(loadMoreRef.current);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [filteredInvoices]);

  // ✅ Slice invoices to visibleCount
  const visibleInvoices = filteredInvoices.slice(0, visibleCount);

  return (
    <Stack>
      <Stack gap="xs" mb="md">
        <Title order={2}>Admin Invoice</Title>
        <Text c="dimmed" size="sm">
          Manage, track, and update invoices from this dashboard.
        </Text>
      </Stack>

      <Group justify="space-between">
        <Group gap="sm">
          <TextInput
            placeholder="Search invoices..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ width: "220px" }}
          />
          <Select
            placeholder="Filter by project"
            value={projectFilter}
            onChange={setProjectFilter}
            data={projectOptions}
            style={{ width: 180 }}
            clearable
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            data={statusOptions}
            style={{ width: 180 }}
            clearable
          />
        </Group>

        <Button leftSection={<IconPlus size={16} />} onClick={handleNew}>
          New Invoice
        </Button>
      </Group>

      {loading ? (
        <Loader mt="lg" />
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Invoice</Table.Th>
                <Table.Th>Invoice Date</Table.Th>
                <Table.Th>Total Amount (₹)</Table.Th>
                <Table.Th>Amount Paid (₹)</Table.Th>
                <Table.Th>Balance (₹)</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Projects</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {visibleInvoices.length > 0 ? (
                visibleInvoices.map((invoice) => (
                  <Table.Tr key={invoice.id}>
                    <Table.Td>
  <Link
    to={`/admin-invoice/${invoice.invoiceNumber}`} // navigate by invoiceNumber
    style={{ color: "#1c7ed6", textDecoration: "none", cursor: "pointer" }}
  >
    {invoice.invoiceNumber}
  </Link>
</Table.Td>
                    <Table.Td>
                      {invoice.invoiceDate
                        ? invoice.invoiceDate.toLocaleDateString()
                        : "-"}
                    </Table.Td>
                    <Table.Td>₹{invoice.totalAmount}</Table.Td>
                    <Table.Td>₹{invoice.amountPaidByClient}</Table.Td>
                    <Table.Td>₹{invoice.balance}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={
                          invoice.status === "Paid"
                            ? "green"
                            : invoice.status === "Under process"
                            ? "yellow"
                            : invoice.status === "Cancelled"
                            ? "red"
                            : "blue"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {Array.isArray(invoice.project) ? (
                        <Group gap="xs">
                          {invoice.project.map((proj) => (
                            <Badge key={String(proj)} color="blue" variant="light">
                              {proj}
                            </Badge>
                          ))}
                        </Group>
                      ) : (
                        <Text>{invoice.project || "-"}</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          color="blue"
                          variant="light"
                          onClick={() => handleEdit(invoice)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => handleDelete(invoice.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <Text ta="center" c="dimmed">
                      No invoices found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>

          {/* 👇 Trigger div for infinite scroll */}
          <div ref={loadMoreRef} style={{ height: 1 }} />
        </>
      )}

      <Modal
        size="55rem"
        opened={opened}
        onClose={close}
        title={selectedInvoice ? "Edit Invoice" : "Add New Invoice"}
        centered
      >
        <InvoiceForm
          onSubmit={fetchInvoices}
          onClose={close}
          initialValues={selectedInvoice ?? undefined}
        />
      </Modal>
    </Stack>
  );
}
