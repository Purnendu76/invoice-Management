import { useEffect, useState } from "react";
import { Table, TextInput, Group, Text, Badge, Stack, Loader, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import axios from "axios";
import type { Invoice } from "@/interface/Invoice";

export default function User_invoice() {
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/invoices");

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

  // ✅ Filter invoices by search
  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack>
      <Stack gap="xs" mb="md">
              <Title order={2}>User Invoice</Title>
              <Text c="dimmed" size="sm">
                View and track your invoices from this dashboard.
              </Text>
            </Stack>
      {/* Search Bar */}
      <Group justify="flex-start">
        <TextInput
          placeholder="Search invoices..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ width: "300px" }}
        />
      </Group>

      {/* Table */}
      {loading ? (
        <Loader mt="lg" />
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Invoice</Table.Th>
              <Table.Th>Invoice Date</Table.Th>
              <Table.Th>Total Amount (₹)</Table.Th>
              <Table.Th>Net Payable (₹)</Table.Th>
              <Table.Th>Amount Paid (₹)</Table.Th>
              <Table.Th>Balance (₹)</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <Table.Tr key={invoice.id}>
                  <Table.Td>{invoice.invoiceNumber}</Table.Td>
                  <Table.Td>
                    {invoice.invoiceDate
                      ? invoice.invoiceDate.toLocaleDateString()
                      : "-"}
                  </Table.Td>
                  <Table.Td>₹{invoice.totalAmount}</Table.Td>
                  <Table.Td>₹{invoice.netPayable}</Table.Td>
                  <Table.Td>₹{invoice.amountPaidByClient}</Table.Td>
                  <Table.Td>₹{invoice.balance}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        invoice.status === "Paid"
                          ? "green"
                          : invoice.status === "Under process"
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
                <Table.Td colSpan={7}>
                  <Text ta="center" c="dimmed">
                    No invoices found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}
