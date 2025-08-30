import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCoin,
  IconFileInvoice,
  IconClockHour4,
} from "@tabler/icons-react";
import { Group, Paper, SimpleGrid, Text, ThemeIcon } from "@mantine/core";
import CountUp from "react-countup";

type Stat = {
  title: string;
  value: string;
  diff: number;
  icon: typeof IconCoin;
  prefix?: string;
};

const data: Stat[] = [
  { title: "Total Revenue", value: "$13,456", diff: 12, icon: IconCoin, prefix: "$" },
  { title: "Paid Invoices", value: "208", diff: 15, icon: IconFileInvoice },
  { title: "Pending Invoices", value: "37", diff: -8, icon: IconClockHour4 },
];

export default function InvoiceStats() {
  const stats = data.map((stat) => {
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="apart">
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
              {stat.title}
            </Text>
            <Group gap="xs" align="center">
              <Text fz="xl" fw={700}>
                <CountUp
                  start={0}
                  end={typeof stat.value === "string" ? Number(stat.value.replace(/[^0-9.-]+/g, "")) : stat.value}
                  duration={2}
                  prefix={stat.prefix || ""}
                  separator=","
                />
              </Text>
              <DiffIcon
                size={20}
                stroke={1.5}
                color={stat.diff > 0 ? "teal" : "red"}
              />
            </Group>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            style={{
              color:
                stat.diff > 0
                  ? "var(--mantine-color-teal-6)"
                  : "var(--mantine-color-red-6)",
            }}
            size={38}
            radius="md"
          >
            <stat.icon size={28} stroke={1.5} />
          </ThemeIcon>
        </Group>
        <Text c="dimmed" fz="sm" mt="md">
          <Text component="span" c={stat.diff > 0 ? "teal" : "red"} fw={700}>
            {stat.diff}%
          </Text>{" "}
          {stat.diff > 0 ? "increase" : "decrease"} compared to last month
        </Text>
      </Paper>
    );
  });

  return (
    <div>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
    </div>
  );
}
