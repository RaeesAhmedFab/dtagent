import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Loader2, AlertCircle } from "lucide-react";
import EmailTemplatePreview from "../../components/EmailTemplatePreview";
import { Separator } from "@/components/ui/separator";
import {
  useGetSystemAlertsQuery,
  usePatchSystemAlertsMutation,
} from "../../redux/Api/adminAlertSystemApi";
import { toast } from "sonner";
import Loader from "../../components/Loader";

const statusStyles = {
  green: { dot: "bg-green-500", badge: "bg-green-100 text-green-800" },
  orange: { dot: "bg-gray-400", badge: "bg-gray-200 text-gray-800" },
};

const AlertSystem = () => {
  const {
    data: alertsData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetSystemAlertsQuery();
  const [patchSystemAlerts, { isLoading: isSaving }] =
    usePatchSystemAlertsMutation();

  const alerts = alertsData?.data;
  const delivery = alerts?.last_24h_delivery;

  // Local state for toggle switches
  const [dailyEmailEnabled, setDailyEmailEnabled] = useState(true);
  const [dailySmsEnabled, setDailySmsEnabled] = useState(true);
  const [weeklyEmailEnabled, setWeeklyEmailEnabled] = useState(true);

  // Sync local state from API data
  useEffect(() => {
    if (!isSuccess || !alerts) return;
    setDailyEmailEnabled(alerts.daily_email_enabled ?? true);
    setDailySmsEnabled(alerts.daily_sms_enabled ?? true);
    setWeeklyEmailEnabled(alerts.weekly_email_enabled ?? true);
  }, [isSuccess, alerts]);

  const Lastdelivery = delivery
    ? [
        {
          title: "Email — Daily",
          price: `${delivery.email_daily?.sent?.toLocaleString() ?? 0} sent`,
          subdes: `${delivery.email_daily?.bounced ?? 0} bounced`,
          status: "green",
        },
        {
          title: "SMS — Daily",
          price: `${delivery.sms_daily?.sent?.toLocaleString() ?? 0} sent`,
          subdes: `${delivery.sms_daily?.retried ?? 0} retried`,
          status: "green",
        },
        {
          title: "STOP replies",
          price: `${delivery.stop_replies?.received ?? 0} received`,
          subdes: delivery.stop_replies?.action || "auto opt-out",
          status: "orange",
        },
      ]
    : [];

  const handleToggle = async (field, value, setter) => {
    setter(value);
    try {
      await patchSystemAlerts({
        id: alerts?.id,
        data: { [field]: value },
      }).unwrap();
      toast.success("Alert setting updated");
    } catch (err) {
      setter(!value);
      toast.error(err?.data?.message || "Failed to update setting");
    }
  };

  if (isLoading) {
    return (
     <>
     <Loader  />
     </>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-gray-600">
          {error?.data?.message || "Failed to load system alerts"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const Dispatchschedule = [
    {
      icon: <Mail />,
      title: "Daily email digest",
      description: `${alerts?.daily_email_schedule_display || "8:00 AM EST"} · ${(alerts?.daily_email_opted_in_count ?? 0).toLocaleString()} opted-in`,
      enabled: dailyEmailEnabled,
      field: "daily_email_enabled",
      setter: setDailyEmailEnabled,
    },
    {
      icon: <Phone />,
      title: "Daily SMS alert",
      description: `${alerts?.daily_sms_schedule_display || "8:00 AM EST"} · ${(alerts?.daily_sms_opted_in_count ?? 0).toLocaleString()} opted-in (TCPA-compliant)`,
      enabled: dailySmsEnabled,
      field: "daily_sms_enabled",
      setter: setDailySmsEnabled,
    },
    {
      icon: <Mail />,
      title: "Weekly roundup (Friday)",
      description: `${alerts?.weekly_email_schedule_display || "Friday 8:00 AM EST"} · ${(alerts?.weekly_email_opted_in_count ?? 0).toLocaleString()} opted-in`,
      enabled: weeklyEmailEnabled,
      field: "weekly_email_enabled",
      setter: setWeeklyEmailEnabled,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dispatch schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Dispatchschedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="mt-0.5">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(val) =>
                      handleToggle(item.field, val, item.setter)
                    }
                    className="ml-auto"
                    disabled={isSaving}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Last 24h delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Lastdelivery.map((item, index) => {
                const s = statusStyles[item.status];
                return (
                  <div key={index}>
                    <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-center w-full">
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 text-[12px] font-medium rounded-full px-2.5 py-0.5 min-w-[48px] justify-center ${s.badge}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                          {item.price}
                        </span>
                        <p className="text-sm text-gray-500">{item.subdes}</p>
                      </div>
                    </div>
                    {index < Lastdelivery.length - 1 && <Separator />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-5">
        <EmailTemplatePreview />
      </div>
    </>
  );
};

export default AlertSystem;