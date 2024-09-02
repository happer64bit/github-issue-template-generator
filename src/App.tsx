import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import PlusIcon from "lucide-solid/icons/plus";
import Header from "./components/Header";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import Textarea from "./components/ui/Textarea";
import Select from "./components/ui/Select";

interface Section {
  type: "Markdown" | "Textarea" | "Input" | "Dropdown";
  value: string;
}

const App: Component = () => {
  const [sections, setSections] = createSignal<Section[]>([{ type: "Markdown", value: "" }]);

  const addSection = () => {
    setSections([...sections(), { type: "Markdown", value: "" }]);
  };

  const handleChange = (index: number, key: keyof Section, value: string) => {
    const updatedSections = [...sections()];

    if (key === "type") {
      updatedSections[index][key] = value as Section["type"];
    } else {
      updatedSections[index][key] = value;
    }

    setSections(updatedSections);
  };

  return (
    <>
      <Header />
      <div class="container">
        <div class="grid grid-cols-2">
          <div class="space-y-4 my-4">
            <div class="space-y-1">
              <label for="name-input">Name</label>
              <Input id="name-input" placeholder="Name" class="w-full" />
            </div>
            <div class="space-y-1">
              <label for="title-input">Title</label>
              <Input id="title-input" placeholder="Title" class="w-full" />
            </div>
            <div class="space-y-1">
              <label for="description-input">Description</label>
              <Textarea rows={4} id="description-input" placeholder="Description" class="w-full" />
            </div>
            <div>
              <h2 class="text-lg">Body</h2>
              <div class="space-y-2">
                <div class="space-y-2 divide-y-[1px]">
                  {sections().map((section, index) => (
                    <div class="space-y-3">
                      <Select
                        class="block"
                        value={section.type}
                        onChange={(e) => handleChange(index, "type", e.target.value as Section["type"])}
                      >
                        <option value="Markdown">Markdown</option>
                        <option value="Textarea">Textarea</option>
                        <option value="Input">Input</option>
                        <option value="Dropdown">Dropdown</option>
                      </Select>
                      <div class="space-y-2">
                        {section.type === "Input" && (
                          <>
                            <label>Placeholder</label>
                            <Input
                              class="w-full block"
                              placeholder="Enter placeholder"
                              value={section.value}
                              onChange={(e) => handleChange(index, "value", e.target.value)}
                            />
                          </>
                        )}
                        {section.type === "Textarea" && (
                          <>
                            <label>Value</label>
                            <Textarea
                              rows={3}
                              class="w-full block"
                              value={section.value}
                              onChange={(e) => handleChange(index, "value", e.target.value)}
                            />
                          </>
                        )}
                        {section.type === "Dropdown" && (
                          <>
                            <label>Options (comma-separated)</label>
                            <Input
                              class="w-full block"
                              placeholder="Enter options"
                              value={section.value}
                              onChange={(e) => handleChange(index, "value", e.target.value)}
                            />
                          </>
                        )}
                        {section.type === "Markdown" && (
                          <>
                            <label>Markdown Content</label>
                            <Textarea
                              rows={3}
                              class="w-full block"
                              placeholder="Enter markdown content"
                              value={section.value}
                              onChange={(e) => handleChange(index, "value", e.target.value)}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div class="flex justify-end mt-4">
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
        </div>
      </div>
    </>
  );
};

export default App;
