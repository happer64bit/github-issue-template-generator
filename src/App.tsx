import { createSignal, createMemo, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import type { Component } from "solid-js";
import PlusIcon from "lucide-solid/icons/plus";
import CopyIcon from "lucide-solid/icons/copy";
import TrashIcon from "lucide-solid/icons/trash";
import Header from "./components/Header";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import Textarea from "./components/ui/Textarea";
import Select from "./components/ui/Select";
import { stringify } from "yaml";
import { Highlight } from "solid-highlight";
import "prismjs";
import "@jongwooo/prism-theme-github/themes/prism-github-default-auto.min.css";
import "prismjs/components/prism-yaml";

interface Section {
  type: "markdown" | "textarea" | "input" | "dropdown" | "checkboxes";
  labels?: string[];
  description?: string;
  placeholder?: string;
  value?: string;
  options?: string[];
  multiple?: boolean;
  required?: boolean;
}

const App: Component = () => {
  const [store, setStore] = createStore({
    name: "",
    title: "",
    description: "",
    labels: [] as string[],
    projects: [] as string[],
    assignees: "",
    sections: [{ type: "markdown", value: "" }] as Section[],
  });

  const [copied, setCopied] = createSignal(false);

  const addSection = () => {
    setStore("sections", (s) => [...s, { type: "markdown", value: "" }]);
  };

  const removeSection = (index: number) => {
    setStore("sections", (s) => s.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, updates: Partial<Section>) => {
    setStore("sections", index, (prev) => ({ ...prev, ...updates }));
  };

  const yamlOutput = createMemo(() => {
    const topFields: any = {
      name: store.name,
      title: store.title,
      description: store.description,
      projects: store.projects
    };

    if (store.labels.length) topFields.labels = store.labels;
    if (store.projects.length) topFields.projects = store.projects;
    if (store.assignees.trim()) topFields.assignees = store.assignees;

    const formData = store.sections
      .map((section, index) => {
        const result: any = { type: section.type.toLowerCase() };

        if (section.type !== "markdown") {
          result.id = `${section.type.toLowerCase().replace(/ /g, "-")}-${index}`;
          const attributes: any = {};

          if (section.labels && section.labels.length > 0)
            attributes.label = section.labels[0];

          if (section.description) attributes.description = section.description;
          if (section.placeholder) attributes.placeholder = section.placeholder;
          if (section.multiple !== undefined) attributes.multiple = section.multiple;

          if (section.type === "input" || section.type === "textarea") {
            if (section.value) attributes.value = section.value;
          }

          if (section.type === "dropdown") {
            if (section.options && section.options.length > 0) {
              attributes.options = section.options;
            }
          }

          if (section.type === "checkboxes") {
            if (section.options && section.options.length > 0) {
              attributes.options = section.options.map((opt) => ({ label: opt }));
            }
          }

          let validations;
          if (section.required !== undefined) {
            validations = { required: section.required };
          }

          result.attributes = attributes;
          if (validations) {
            result.validations = validations;
          }
        } else if (section.value) {
          result.attributes = { value: section.value };
        }

        return result;
      })
      .filter((item) => Object.keys(item.attributes || {}).length > 0);

    return stringify({ ...topFields, body: formData }, {
      blockQuote: true,
    });
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(yamlOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <div class="container">
        <div class="grid md:grid-cols-2 gap-10">
          <div class="space-y-4 my-4">
            {["name", "title", "description", "labels", "projects", "assignees"].map((field) => (
              <div class="space-y-1">
                <label for={`${field}-input`} class="text-sm capitalize">{field}</label>
                {field === "description" ? (
                  <Textarea
                    id={`${field}-input`}
                    placeholder={`Enter ${field}`}
                    rows={4}
                    class="w-full"
                    value={store[field as keyof typeof store] as string}
                    onInput={(e) => setStore(field as keyof typeof store, e.currentTarget.value)}
                  />
                ) : (
                  <Input
                    id={`${field}-input`}
                    placeholder={`Enter ${field}`}
                    class="w-full"
                    value={
                      field === "labels" || field === "projects"
                        ? (store.labels || []).join(", ")
                        : (store[field as keyof typeof store] as string)
                    }
                    onInput={(e) => {
                      if (field === "labels" || field === "projects") {
                        const newLabels = e.currentTarget.value
                          .split(",")
                          .map((label) => label.trim())
                          .filter(Boolean);
                        setStore(field, newLabels);
                      } else {
                        setStore(field as keyof typeof store, e.currentTarget.value);
                      }
                    }}
                  />
                )}
              </div>
            ))}

            <div>
              <h2 class="text-lg">Body</h2>
              <div class="space-y-2 divide-y-[1px] dark:divide-white/20">
                <For each={store.sections}>
                  {(section, index) => (
                    <div class="space-y-3 py-2">
                      <div class="flex justify-between items-center">
                        <Select
                          class="block my-4 capitalize"
                          value={section.type}
                          onInput={(e) =>
                            handleChange(index(), { type: e.currentTarget.value as Section["type"] })
                          }
                        >
                          {["markdown", "textarea", "input", "dropdown", "checkboxes"].map((type) => (
                            <option value={type}>{type}</option>
                          ))}
                        </Select>
                        <Button
                          variety="icon"
                          onClick={() => removeSection(index())}
                        >
                          <TrashIcon size={16} class="text-red-600" />
                        </Button>
                      </div>
                      <div class="space-y-2">
                        <Show when={section.type !== "markdown"}>
                          <Input
                            class="w-full block"
                            placeholder="Enter label (used as title)"
                            value={section.labels?.[0] || ""}
                            onInput={(e) => {
                              const label = e.currentTarget.value.trim();
                              handleChange(index(), { labels: label ? [label] : [] });
                            }}
                          />
                          <Input
                            class="w-full block"
                            placeholder="Enter description"
                            value={section.description || ""}
                            onInput={(e) =>
                              handleChange(index(), { description: e.currentTarget.value })
                            }
                          />
                          {section.type === "input" && (
                            <>
                              <Input
                                class="w-full block"
                                placeholder="Enter placeholder"
                                value={section.placeholder || ""}
                                onInput={(e) =>
                                  handleChange(index(), { placeholder: e.currentTarget.value })
                                }
                              />
                              <Input
                                class="w-full block"
                                placeholder="Enter value"
                                value={section.value || ""}
                                onInput={(e) =>
                                  handleChange(index(), { value: e.currentTarget.value })
                                }
                              />
                            </>
                          )}
                          {section.type === "textarea" && (
                            <Textarea
                              rows={3}
                              class="w-full block"
                              placeholder="Enter text"
                              value={section.value || ""}
                              onInput={(e) =>
                                handleChange(index(), { value: e.currentTarget.value })
                              }
                            />
                          )}
                          {(section.type === "dropdown" || section.type === "checkboxes") && (
                            <>
                              <Input
                                class="w-full block"
                                placeholder="Enter options (comma separated)"
                                value={section.options?.join(", ") || ""}
                                onInput={(e) =>
                                  handleChange(index(), {
                                    options: e.currentTarget.value
                                      .split(",")
                                      .map((opt) => opt.trim())
                                      .filter(Boolean),
                                  })
                                }
                              />
                            </>
                          )}
                          <div class="mt-4">
                            <label class="flex items-center">
                              <input
                                type="checkbox"
                                checked={section.required || false}
                                onChange={(e) =>
                                  handleChange(index(), { required: e.currentTarget.checked })
                                }
                              />
                              <div class="px-1"></div>
                              Required
                            </label>
                          </div>
                        </Show>

                        <Show when={section.type === "markdown"}>
                          <Textarea
                            rows={3}
                            class="w-full block"
                            placeholder="Enter markdown content"
                            value={section.value || ""}
                            onInput={(e) => handleChange(index(), { value: e.currentTarget.value })}
                          />
                        </Show>
                      </div>
                    </div>
                  )}
                </For>

                <div class="flex justify-end my-6 py-4">
                  <Button
                    variety="primary"
                    class="flex gap-1 py-1.5 items-center"
                    onClick={addSection}
                  >
                    <PlusIcon size={14} />
                    Add Section
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <div class="flex justify-end">
              <button
                class="px-4 py-1 flex items-center gap-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 rounded transform duration-200 border border-[#b7b7b7] dark:border-[#2f2f2f]"
                onClick={handleCopy}
              >
                {copied() ? "Copied" : "Copy"}
                <CopyIcon size={17} class="text-gray-400" />
              </button>
            </div>
            <Highlight language="yaml">{yamlOutput()}</Highlight>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
