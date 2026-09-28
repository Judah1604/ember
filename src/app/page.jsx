import { supabase } from "@/lib/supabase";

export default async function Home() {
    const { data, error } = await supabase
		.from("users")
		.select('*')

	console.log(data);
	console.log(error);

	return <div>Home</div>;
}
