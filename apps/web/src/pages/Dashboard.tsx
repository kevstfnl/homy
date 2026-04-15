import { createSignal } from "solid-js";
import {
	Badge,
	Button,
	Card,
	createToaster,
	Dialog,
	Input,
	SelectField,
	SwitchField,
	Textarea,
	ThemeToggle,
	ToastRegion,
	Tooltip,
} from "../components";
import { useTheme } from "../libs/theme/ThemeProvider";

export default function Dashboard() {
	const { theme } = useTheme();
	const toaster = createToaster();
	const [formData, setFormData] = createSignal({
		name: "",
		email: "",
		message: "",
		category: "",
		subscribe: false,
	});

	return (
		<div class="min-h-screen bg-bg text-text">
			{/* Toast Region */}
			<ToastRegion toaster={toaster} />

			{/* Header */}
			<header class="border-b border-border sticky top-0 bg-surface/80 backdrop-blur-sm">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
					<h1 class="text-2xl font-bold">Homy Design System</h1>
					<Tooltip content={`Switch to ${theme() === "light" ? "dark" : "light"} mode`}>
						<ThemeToggle />
					</Tooltip>
				</div>
			</header>

			{/* Main Content */}
			<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Buttons Section */}
				<section class="mb-12">
					<h2 class="text-xl font-semibold mb-6">Buttons</h2>
					<div class="flex flex-wrap gap-4">
						<Button variant="primary">Primary Button</Button>
						<Button variant="secondary">Secondary Button</Button>
						<Button variant="ghost">Ghost Button</Button>
						<Button variant="danger">Danger Button</Button>
						<Button variant="primary" size="sm">
							Small
						</Button>
						<Button variant="primary" size="lg">
							Large
						</Button>
						<Button variant="primary" disabled>
							Disabled
						</Button>
					</div>
				</section>

				{/* Badges Section */}
				<section class="mb-12">
					<h2 class="text-xl font-semibold mb-6">Badges</h2>
					<div class="flex flex-wrap gap-4">
						<Badge variant="default">Default</Badge>
						<Badge variant="success">Success</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="error">Error</Badge>
						<Badge variant="info">Info</Badge>
					</div>
				</section>

				{/* Cards Section */}
				<section class="mb-12">
					<h2 class="text-xl font-semibold mb-6">Cards</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card>
							<Card.Header>
								<h3 class="text-lg font-semibold">Card Title</h3>
							</Card.Header>
							<Card.Content>
								<p class="text-sm text-muted">This is a card component with header, content, and footer sections.</p>
							</Card.Content>
							<Card.Footer>
								<Button variant="secondary" size="sm">
									Cancel
								</Button>
								<Button variant="primary" size="sm">
									Save
								</Button>
							</Card.Footer>
						</Card>

						<Card>
							<Card.Header>
								<h3 class="text-lg font-semibold">Features</h3>
							</Card.Header>
							<Card.Content>
								<ul class="space-y-2 text-sm">
									<li class="flex items-center gap-2">
										<span class="text-primary">✓</span> Soft/Rounded Style
									</li>
									<li class="flex items-center gap-2">
										<span class="text-primary">✓</span> Light/Dark Themes
									</li>
									<li class="flex items-center gap-2">
										<span class="text-primary">✓</span> View Transition Animation
									</li>
								</ul>
							</Card.Content>
						</Card>
					</div>
				</section>

				{/* Form Section */}
				<section class="mb-12">
					<h2 class="text-xl font-semibold mb-6">Form Controls</h2>
					<Card class="max-w-2xl">
						<Card.Header>
							<h3 class="text-lg font-semibold">Contact Form</h3>
						</Card.Header>
						<Card.Content>
							<div class="space-y-6">
								<Input
									label="Name"
									placeholder="John Doe"
									value={formData().name}
									onChange={(e) => setFormData((prev) => ({ ...prev, name: e.currentTarget.value }))}
									helperText="Enter your full name"
								/>

								<Input
									label="Email"
									type="email"
									placeholder="john@example.com"
									value={formData().email}
									onChange={(e) => setFormData((prev) => ({ ...prev, email: e.currentTarget.value }))}
								/>

								<SelectField
									label="Category"
									placeholder="Select a category"
									items={[
										{ label: "Support", value: "support" },
										{ label: "Feedback", value: "feedback" },
										{ label: "Bug Report", value: "bug" },
									]}
									value={formData().category}
									onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
								/>

								<Textarea
									label="Message"
									placeholder="Your message here..."
									rows={4}
									value={formData().message}
									onChange={(e) => setFormData((prev) => ({ ...prev, message: e.currentTarget.value }))}
								/>

								<SwitchField
									label="Subscribe to updates"
									checked={formData().subscribe}
									onChange={(checked) => setFormData((prev) => ({ ...prev, subscribe: checked }))}
									helperText="Get notified about new features"
								/>
							</div>
						</Card.Content>
						<Card.Footer>
							<Button variant="secondary" size="md">
								Cancel
							</Button>
							<Button
								variant="primary"
								size="md"
								onClick={() => {
									toaster.success("Form submitted!", "Your message has been sent.");
								}}
							>
								Submit
							</Button>
						</Card.Footer>
					</Card>
				</section>

				{/* Dialog Section */}
				<section class="mb-12">
					<h2 class="text-xl font-semibold mb-6">Dialog & Toast</h2>
					<div class="flex gap-4 flex-wrap">
						<Dialog>
							<Dialog.Trigger>Open Dialog</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Title>Confirm Action</Dialog.Title>
								<Dialog.Description>Are you sure you want to proceed with this action?</Dialog.Description>
								<div class="mt-6 flex gap-2 justify-end">
									<Dialog.Close>Cancel</Dialog.Close>
									<Button
										variant="primary"
										size="md"
										onClick={() => {
											toaster.success("Confirmed!", "Action completed.");
										}}
									>
										Confirm
									</Button>
								</div>
							</Dialog.Content>
						</Dialog>

						<Button variant="secondary" onClick={() => toaster.info("Info Toast", "This is an informational message.")}>
							Info Toast
						</Button>

						<Button variant="secondary" onClick={() => toaster.warning("Warning!", "Please be careful.")}>
							Warning Toast
						</Button>

						<Button variant="secondary" onClick={() => toaster.error("Error!", "Something went wrong.")}>
							Error Toast
						</Button>
					</div>
				</section>

				{/* Info Section */}
				<section class="mb-12">
					<Card class="max-w-2xl bg-surface-raised">
						<Card.Header>
							<h3 class="text-lg font-semibold">About this Design System</h3>
						</Card.Header>
						<Card.Content class="text-sm space-y-4">
							<p>
								<strong>Theme:</strong> {theme() === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}
							</p>
							<p>
								<strong>Color Palette:</strong> Indigo/Blue with soft, rounded design aesthetic
							</p>
							<p>
								<strong>Components:</strong> Built with Ark UI (headless) + UnoCSS + SolidJS
							</p>
							<p>
								<strong>Features:</strong>
							</p>
							<ul class="list-disc list-inside space-y-1 text-muted">
								<li>Data-attribute based theming (no .dark classes)</li>
								<li>View Transition API for smooth theme switching</li>
								<li>Fully typed TypeScript components</li>
								<li>Accessible form controls with Ark UI</li>
								<li>Toast notifications system</li>
							</ul>
						</Card.Content>
					</Card>
				</section>
			</main>
		</div>
	);
}
