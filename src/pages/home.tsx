import { useState } from "react";
import {
  Table,
  TextInput,
  Group,
  Button,
  Modal,
  Text,
  Badge,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import InvoiceForm from "../components/InvoiceForm";

type Invoice = {
  id: string;
  client: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
};

const initialInvoices: Invoice[] = [
  { id: "INV-001", client: "John Doe", amount: 250, status: "Paid", date: "2025-08-01" },
  { id: "INV-002", client: "Jane Smith", amount: 480, status: "Pending", date: "2025-08-05" },
  { id: "INV-003", client: "Acme Corp", amount: 1200, status: "Overdue", date: "2025-08-10" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  // Modal state
  const [opened, { open, close }] = useDisclosure(false);

  // Filtered invoices
  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddInvoice = (client: string, amount: number) => {
    const newInvoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      client,
      amount,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    setInvoices((prev) => [...prev, newInvoice]);
    close();
  };

  return (
    <Stack>
      {/* Search + Add */}
      <Group justify="space-between">
        <TextInput
          placeholder="Search invoices..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ width: "300px" }}
        />
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          New Invoice
        </Button>
      </Group>

      {/* Table */}
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Invoice ID</Table.Th>
            <Table.Th>Client</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <Table.Tr key={invoice.id}>
                <Table.Td>{invoice.id}</Table.Td>
                <Table.Td>{invoice.client}</Table.Td>
                <Table.Td>{invoice.date}</Table.Td>
                <Table.Td>${invoice.amount}</Table.Td>
                <Table.Td>
                  <Badge
                    color={
                      invoice.status === "Paid"
                        ? "green"
                        : invoice.status === "Pending"
                        ? "yellow"
                        : "red"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Text ta="center" c="dimmed">
                  No invoices found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {/* Modal */}
      <Modal size='55rem' opened={opened} onClose={close} title="Add New Invoice" centered>
        <InvoiceForm onSubmit={handleAddInvoice} onCancel={close} />
      </Modal>
    </Stack>
  );
}
