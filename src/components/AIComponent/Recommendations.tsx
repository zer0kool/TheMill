import { component$ } from "@builder.io/qwik";

interface Recommendation {
    id: number;
    name: string;
    price: number;
}

interface RecommendationsProps {
    recommendations: Recommendation[];
}

const Recommendations = component$(({ recommendations }: RecommendationsProps) => {
    return (
        <div class="recommendations">
            {recommendations.length > 0 ? (
                <ul>
                    {recommendations.map(item => (
                        <li key={item.id}>
                            {item.name} - ${item.price}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recommendations found.</p>
            )}
        </div>
    );
});

export default Recommendations;
