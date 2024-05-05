import { useState } from "react";
import { Card, TextContainer, Text } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();
  const productsCount = 5;

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("ProductsCard.productsCreatedToast", {
          count: productsCount,
        }),
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: t("ProductsCard.errorCreatingProductsToast"),
        error: true,
      });
    }
  };

  const handleThemes = async () => {
    const response = await fetch("/api/themes/all");
    return await response.json();
  };

  const updateThemes = async () => {
    const themes = await handleThemes();
    var theme = null;
    var id = "";

    for (let i = 0; i < themes.data.length; i++) {
      theme = themes.data[i];
      if (theme.role === "main") {
        id = theme.id;
        break;
      }
    }

    const assetResponse = await fetch("/api/themes/" + id);
    const asset = await assetResponse.json();
    const currentValue = asset.data[0].value;

    // Check if the script is already present in the theme.liquid file
    const scriptToInsert =
      '<script src="https://raselhasan356.github.io/popup.js" defer="defer"></script>';
    if (currentValue.includes(scriptToInsert)) {
      return;
    }

    // Add the script to the theme.liquid file
    const newContent = currentValue.replace(
      "</head>",
      scriptToInsert + "</head>"
    );

    // Update the theme with the modified content
    const response = await fetch("/api/themes/update/" + id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: newContent,
      }),
    });
  };

  updateThemes();

  return (
    <>
      {toastMarkup}
      <Card
        title={t("ProductsCard.title")}
        sectioned
        primaryFooterAction={{
          content: t("ProductsCard.populateProductsButton", {
            count: productsCount,
          }),
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>{t("ProductsCard.description")}</p>
          <Text as="h4" variant="headingMd">
            {t("ProductsCard.totalProductsHeading")}
            <Text variant="bodyMd" as="p" fontWeight="semibold">
              {isLoadingCount ? "-" : data.count}
            </Text>
          </Text>
        </TextContainer>
      </Card>
    </>
  );
}
